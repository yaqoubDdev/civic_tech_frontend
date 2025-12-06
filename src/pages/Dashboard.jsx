import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HeatmapLayer from '../components/HeatmapLayer';
import PriorityTable from '../components/PriorityTable';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch
    const fetchReports = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockReports = [
        { id: 1, title: 'Broken Street Light', category: 'power', type: 'Outage', priorityScore: 5, status: 'Open', location: [8.466, -13.232] },
        { id: 2, title: 'Large Pothole', category: 'roads', type: 'Pothole', priorityScore: 8, status: 'Open', location: [8.465, -13.231] },
        { id: 3, title: 'Water Leak', category: 'water', type: 'Leak', priorityScore: 9, status: 'Scheduled', location: [8.467, -13.230] },
        { id: 4, title: 'Overflowing Bin', category: 'waste', type: 'Overflowing Bin', priorityScore: 3, status: 'Resolved', location: [8.464, -13.233] },
        { id: 5, title: 'Flickering Light', category: 'power', type: 'Flickering', priorityScore: 4, status: 'Open', location: [8.466, -13.231] },
        { id: 6, title: 'Burst Pipe', category: 'water', type: 'Burst Pipe', priorityScore: 10, status: 'Open', location: [8.468, -13.229] },
      ];

      setReports(mockReports);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const handleStatusChange = (id, newStatus, note) => {
    console.log(`Updating report ${id} to ${newStatus} with note: ${note}`);
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, status: newStatus } : report
    ));
  };

  const escalatedCount = reports.filter(r => r.priorityScore >= 8 && r.status !== 'Resolved').length;

  // Assuming heatmapPoints would be derived from reports, e.g.:
  const heatmapPoints = reports.map(report => ({
    lat: report.location[0],
    lng: report.location[1],
    value: report.priorityScore // Or some other value for intensity
  }));

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
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
                <HeatmapLayer points={heatmapPoints} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Table Section */}
        <PriorityTable reports={reports} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default Dashboard;
