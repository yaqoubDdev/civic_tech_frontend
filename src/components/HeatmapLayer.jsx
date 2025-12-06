import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Transform points to [lat, lng, intensity]
    // For now, we assume points are [lat, lng] and intensity is 1
    // Or points could be objects with lat, lng, priority
    const heatPoints = points.map(p => {
      if (Array.isArray(p)) return [...p, 0.5]; // Default intensity
      return [p.lat, p.lng, p.intensity || 0.5];
    });

    const heat = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

export default HeatmapLayer;
