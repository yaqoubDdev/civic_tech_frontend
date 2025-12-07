import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HeatmapLayer from '../components/HeatmapLayer';
import { getReports } from '../services/api';
import Header from '../components/Header';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      const transformedReports = data.map(report => ({
        id: report._id,
        title: report.title || `${report.category} - ${report.type}`,
        category: report.category?.toLowerCase(),
        type: report.type,
        priorityScore: report.priorityScore || 0,
        status: report.status,
        location: [report.location.lat, report.location.lng],
        votes: report.votes,
        image: report.image, // Include image URL
      }));
      setReports(transformedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Community Map</h1>
          <p className="text-muted-foreground mb-6">
            View all reported issues in your community
          </p>
          
          {loading ? (
            <div className="text-center text-muted-foreground">Loading map...</div>
          ) : (
            <div className="h-[600px] rounded-lg overflow-hidden border shadow-lg">
              <MapContainer 
                center={[8.485488, -13.226863]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer reports={reports} />
                
                {/* Show markers for each report */}
                {reports.map((report) => (
                  <Marker key={report.id} position={report.location}>
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
          )}
        </div>
      </div>
    </>
  );
};

export default MapPage;
