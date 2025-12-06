import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    if (!reports || reports.length === 0) return;

    // Extract points: [lat, lng, intensity]
    // Intensity based on priorityScore (normalized 0-1 if needed, or just raw count)
    const points = reports.map(report => [
      report.location[0],
      report.location[1],
      report.priorityScore ? report.priorityScore / 10 : 0.5 // Example intensity
    ]);

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.4: 'blue',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, reports]);

  return null;
};

export default HeatmapLayer;
