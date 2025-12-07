import React, { useState, useEffect } from 'react';
import { MapPin, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getReports, upvoteReport } from '../services/api';

// Calculate distance between two coordinates in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

const NearbyReports = ({ location }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upvoting, setUpvoting] = useState({});

  useEffect(() => {
    if (!location || location.length !== 2) return;

    const fetchNearbyReports = async () => {
      setLoading(true);
      try {
        const allReports = await getReports();
        
        // Calculate distance for each report and filter nearby ones (within 500m)
        const nearbyReports = allReports
          .map(report => {
            const distance = calculateDistance(
              location[0],
              location[1],
              report.location.lat,
              report.location.lng
            );
            return {
              id: report._id,
              title: report.title || `${report.category} - ${report.type}`,
              type: report.type,
              category: report.category,
              distance: distance,
              distanceFormatted: formatDistance(distance),
              upvotes: report.votes || 0,
              status: report.status,
              location: [report.location.lat, report.location.lng]
            };
          })
          .filter(report => report.distance < 500 && report.distance > 0) // Within 500m, exclude current location
          .sort((a, b) => a.distance - b.distance) // Sort by closest first
          .slice(0, 3); // Show max 3 nearby reports

        setReports(nearbyReports);
      } catch (error) {
        console.error('Error fetching nearby reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyReports();
  }, [location]);

  const handleUpvote = async (reportId) => {
    try {
      setUpvoting(prev => ({ ...prev, [reportId]: true }));
      
      const updatedReport = await upvoteReport(reportId);
      
      // Update local state with new vote count
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, upvotes: updatedReport.votes }
          : report
      ));
    } catch (error) {
      console.error('Error upvoting report:', error);
      alert('Failed to upvote. Please try again.');
    } finally {
      setUpvoting(prev => ({ ...prev, [reportId]: false }));
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground animate-pulse">Checking for nearby reports...</div>;
  }

  if (reports.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-orange-800 dark:text-orange-400 flex items-center gap-2">
          <MapPin size={16} />
          Similar reports nearby
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reports.map(report => (
          <Card key={report.id} className="bg-card">
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex-1">
                <div className="font-medium">{report.title}</div>
                <div className="text-xs text-muted-foreground">
                  {report.type} • {report.distanceFormatted} away • {report.status}
                </div>
              </div>
              <Button
                onClick={() => handleUpvote(report.id)}
                disabled={upvoting[report.id]}
                variant="secondary"
                size="sm"
                className="gap-1 ml-2"
              >
                <ThumbsUp size={14} />
                <span>{upvoting[report.id] ? '...' : report.upvotes}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
          💡 If you see your issue above, please upvote it instead of creating a new report.
        </p>
      </CardContent>
    </Card>
  );
};

export default NearbyReports;
