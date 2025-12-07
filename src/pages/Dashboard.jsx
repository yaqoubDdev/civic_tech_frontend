import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HeatmapLayer from '../components/HeatmapLayer';
import PriorityTable from '../components/PriorityTable';
import { getReports, updateReportStatus } from '../services/api';
import Header from '../components/Header';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports();
      
      // Transform backend data to match frontend format
      const transformedReports = data.map(report => ({
        id: report._id,
        title: report.title || `${report.category} - ${report.type}`,
        category: report.category?.toLowerCase(),
        type: report.type,
        priorityScore: report.priorityScore || 0,
        status: report.status,
        location: [report.location.lat, report.location.lng],
        votes: report.votes,
        primaryOwner: report.primaryOwner,
        createdAt: report.createdAt,
      }));
      
      setReports(transformedReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, note) => {
    try {
      console.log(`Updating report ${id} to ${newStatus} with note: ${note}`);
      
      // Update via API
      await updateReportStatus(id, newStatus);
      
      // Update local state
      setReports(prev => prev.map(report => 
        report.id === id ? { ...report, status: newStatus } : report
      ));
      
      // Show confetti if resolved
      if (newStatus === 'Resolved') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const escalatedCount = reports.filter(r => r.priorityScore >= 8 && r.status !== 'Resolved').length;

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {escalatedCount > 0 && (
            <Card className="border-l-4 border-l-destructive bg-destructive/10">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertTriangle className="text-destructive" size={24} />
                <div>
                  <h3 className="font-bold">Escalation Alert</h3>
                  <p className="text-sm">
                    ⚠️ {escalatedCount} Ticket{escalatedCount > 1 ? 's have' : ' has'} escalated to Gov Oversight! Immediate action required.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Government Dashboard</h1>
              <p className="text-sm text-muted-foreground">Overview of citizen reports and priority issues</p>
            </div>
            <Card>
              <CardContent className="p-4">
                <span className="text-sm font-medium text-muted-foreground">Total Reports: </span>
                <span className="text-lg font-bold text-primary">{reports.length}</span>
              </CardContent>
            </Card>
          </header>

          {/* Heatmap Section */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden border">
                <MapContainer 
                  center={[8.485488, -13.226863]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <HeatmapLayer reports={reports} />
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Table Section */}
          <PriorityTable reports={reports} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
