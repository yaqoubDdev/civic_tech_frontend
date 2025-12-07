import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ reports }) => {
  const map = useMap();

  useEffect(() => {
    if (!reports || reports.length === 0) return;

    // For density-based clustering, use constant intensity
    // The heatmap will automatically show red where many reports cluster
    // and blue where there are fewer reports
    const points = reports.map(report => [
      report.location[0],
      report.location[1],
      1 // Constant intensity - let density determine the color
    ]);

    const heat = L.heatLayer(points, {
      radius: 40,        // Larger radius to show clustering better
      blur: 30,          // More blur for smoother density visualization
      maxZoom: 17,
      max: 5,            // Max intensity threshold (red when 5+ reports cluster)
      minOpacity: 0.6,   // Minimum opacity for visibility
      gradient: {
        0.0: 'rgba(0, 0, 255, 1)',      // Blue - low density (1-2 reports)
        0.2: 'rgba(0, 255, 255, 1)',    // Cyan - low-medium density
        0.4: 'rgba(0, 255, 0, 1)',      // Lime - medium density (3 reports)
        0.6: 'rgba(255, 255, 0, 1)',    // Yellow - medium-high density (4 reports)
        0.8: 'rgba(255, 165, 0, 1)',    // Orange - high density (5 reports)
        1.0: 'rgba(255, 0, 0, 1)'       // Red - very high density (5+ reports)
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, reports]);

  return null;
};

export default HeatmapLayer;
