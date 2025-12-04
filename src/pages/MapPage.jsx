import React from 'react';
import Map from '../components/Map';

const MapPage = () => {
  const sampleMarkers = [
    { position: [51.505, -0.09], popup: 'Sample Issue Location' }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Community Map</h1>
      <Map center={[51.505, -0.09]} zoom={13} markers={sampleMarkers} />
    </div>
  );
};

export default MapPage;
