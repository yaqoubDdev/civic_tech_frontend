import React, { useState, useEffect } from 'react';
import { MapPin, ThumbsUp } from 'lucide-react';

const NearbyReports = ({ location, onUpvote }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    const fetchNearbyReports = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - in a real app, this would come from the backend based on lat/lng
      const mockReports = [
        {
          id: 1,
          title: 'Broken Street Light',
          type: 'Outage',
          distance: '50m',
          upvotes: 5,
          location: [location[0] + 0.001, location[1] + 0.001]
        },
        {
          id: 2,
          title: 'Large Pothole',
          type: 'Pothole',
          distance: '120m',
          upvotes: 12,
          location: [location[0] - 0.001, location[1] - 0.001]
        }
      ];

      setReports(mockReports);
      setLoading(false);
    };

    fetchNearbyReports();
  }, [location]);

  if (loading) {
    return <div className="text-sm text-gray-500 animate-pulse">Checking for nearby reports...</div>;
  }

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 bg-orange-50 p-4 rounded-lg border border-orange-200">
      <h3 className="text-sm font-semibold text-orange-800 flex items-center gap-2">
        <MapPin size={16} />
        Similar reports nearby
      </h3>
      <div className="space-y-2">
        {reports.map(report => (
          <div key={report.id} className="bg-white p-3 rounded border border-orange-100 flex justify-between items-center shadow-sm">
            <div>
              <div className="font-medium text-gray-800">{report.title}</div>
              <div className="text-xs text-gray-500">{report.type} • {report.distance} away</div>
            </div>
            <button
              onClick={() => onUpvote(report.id)}
              className="flex items-center gap-1 text-sm bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-200 transition-colors"
              type="button"
            >
              <ThumbsUp size={14} />
              <span>Upvote ({report.upvotes})</span>
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-orange-700 mt-2">
        If you see your issue above, please upvote it instead of creating a new report.
      </p>
    </div>
  );
};

export default NearbyReports;
