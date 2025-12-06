import React from 'react';
import Map from '../components/Map';

const MapPage = () => {
  const sampleMarkers = [
    { position: [8.485488, -13.226863], popup: 'Freetown, Sierra Leone' }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Community Map</h1>
      <Map center={[8.485488, -13.226863]} zoom={13} markers={sampleMarkers} />
    </div>
  );
};

export default MapPage;
