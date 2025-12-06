import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../components/HeatmapLayer';
import PriorityTable from '../components/PriorityTable';
import 'leaflet/dist/leaflet.css';
import confetti from 'canvas-confetti';
import { AlertTriangle } from 'lucide-react';

// Mock Data
const INITIAL_REPORTS = [
  {
    id: 1,
    title: 'Major Pipe Burst',
    category: 'Water',
    department: 'water',
    priorityScore: 95,
    status: 'Open',
    location: [8.4665, -13.2325],
    address: '123 Main St',
    timeAgo: '2h ago',
  },
  {
    id: 2,
    title: 'Dangerous Pothole',
    category: 'Roads',
    department: 'roads',
    priorityScore: 75,
    status: 'Scheduled',
    location: [8.4655, -13.2315],
    address: '45 Circular Rd',
    timeAgo: '5h ago',
  },
  {
    id: 3,
    title: 'Street Light Out',
    category: 'Power',
    department: 'power',
    priorityScore: 45,
    status: 'Open',
    location: [8.4675, -13.2335],
    address: '89 Wilkinson Rd',
    timeAgo: '1d ago',
  },
  {
    id: 4,
    title: 'Garbage Pileup',
    category: 'Waste',
    department: 'waste',
    priorityScore: 60,
    status: 'Resolved',
    location: [8.4645, -13.2305],
    address: 'Market Junction',
    timeAgo: '3d ago',
  },
  {
    id: 5,
    title: 'Flooded Intersection',
    category: 'Roads',
    department: 'roads',
    priorityScore: 88,
    status: 'Open',
    location: [8.4660, -13.2320],
    address: 'Kissy Rd',
    timeAgo: '4h ago',
  },
];

const Dashboard = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const handleStatusChange = (id, newStatus) => {
    setReports(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));

    if (newStatus === 'Resolved') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Prepare points for heatmap: { lat, lng, intensity }
  const heatmapPoints = reports.map(r => ({
    lat: r.location[0],
    lng: r.location[1],
    intensity: r.priorityScore / 100 // Normalize score to 0-1
  }));

  const escalatedCount = reports.filter(r => r.priorityScore > 90 && r.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {escalatedCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex items-center gap-3 animate-pulse">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <h3 className="text-red-800 font-bold">Escalation Alert</h3>
              <p className="text-red-700 text-sm">
                ⚠️ {escalatedCount} Ticket{escalatedCount > 1 ? 's have' : ' has'} escalated to Gov Oversight! Immediate action required.
              </p>
            </div>
          </div>
        )}

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Government Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of citizen reports and priority issues</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-600">Total Reports: </span>
            <span className="text-lg font-bold text-blue-600">{reports.length}</span>
          </div>
        </header>

        {/* Heatmap Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Issue Heatmap</h2>
          <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
            <MapContainer 
              center={[8.4657, -13.2317]} 
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
        </div>

        {/* Priority Table Section */}
        <PriorityTable reports={reports} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default Dashboard;
