import React, { useState, useEffect } from 'react';
import { MapPin, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    return <div className="text-sm text-muted-foreground animate-pulse">Checking for nearby reports...</div>;
  }

  if (reports.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-orange-800 flex items-center gap-2">
          <MapPin size={16} />
          Similar reports nearby
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reports.map(report => (
          <Card key={report.id} className="bg-card">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{report.title}</div>
                <div className="text-xs text-muted-foreground">{report.type} • {report.distance} away</div>
              </div>
              <Button
                onClick={() => onUpvote(report.id)}
                variant="secondary"
                size="sm"
                className="gap-1"
              >
                <ThumbsUp size={14} />
                <span>Upvote ({report.upvotes})</span>
              </Button>
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-orange-700 mt-2">
          If you see your issue above, please upvote it instead of creating a new report.
        </p>
      </CardContent>
    </Card>
  );
};

export default NearbyReports;
