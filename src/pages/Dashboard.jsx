import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HeatmapLayer from '../components/HeatmapLayer';
import PriorityTable from '../components/PriorityTable';
import StatusUpdater from '../components/StatusUpdater';
import { getReports, updateReportStatus } from '../services/api';
import Header from '../components/Header';
import confetti from 'canvas-confetti';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view changes
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapCenter, setMapCenter] = useState([8.485488, -13.226863]);
  const [mapZoom, setMapZoom] = useState(13);
  const mapRef = useRef(null);

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

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setMapCenter(report.location);
    setMapZoom(16); // Zoom in closer when clicking a report
  };

  const escalatedCount = reports.filter(r => r.priorityScore >= 8 && r.status !== 'Resolved').length;

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-[1800px] mx-auto space-y-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-start">
            {/* Heatmap Section - Sticky on Desktop */}
            <div className="lg:sticky lg:top-6 order-2 lg:order-1">
              <Card className="h-full shadow-md">
                <CardHeader>
                  <CardTitle>Issue Heatmap & Markers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] rounded-lg overflow-hidden border">
                    <MapContainer 
                      center={mapCenter} 
                      zoom={mapZoom} 
                      style={{ height: '100%', width: '100%' }}
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapViewController center={mapCenter} zoom={mapZoom} />
                      <HeatmapLayer reports={reports} />
                      
                      {/* Individual markers for each report */}
                      {reports.map((report) => (
                        <Marker 
                          key={report.id} 
                          position={report.location}
                          eventHandlers={{
                            click: () => handleReportClick(report),
                          }}
                        >
                          <Popup maxWidth={300}>
                            <div className="p-2">
                              {report.image && (
                                <img 
                                  src={report.image} 
                                  alt={report.title}
                                  className="w-full h-32 object-cover rounded mb-2"
                                />
                              )}
                              <h3 className="font-bold text-base">{report.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">Category: {report.category}</p>
                              <p className="text-sm text-gray-600">Status: {report.status}</p>
                              <p className="text-sm text-gray-600">Priority: {report.priorityScore}</p>
                              <p className="text-sm text-gray-600">Votes: {report.votes}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Click on a report in the table to focus the map
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Priority Table Section */}
            <div className="min-w-0 order-1 lg:order-2"> {/* Prevent table overflow */}
              <PriorityTable 
                reports={reports} 
                onStatusChange={handleStatusChange}
                onReportClick={handleReportClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
