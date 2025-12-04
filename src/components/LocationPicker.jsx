import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and marker dragging
function DraggableMarker({ position, setPosition }) {
  const [draggable, setDraggable] = useState(true);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return (
    <Marker
      draggable={draggable}
      position={position}
      eventHandlers={{
        dragend(e) {
          setPosition(e.target.getLatLng());
        },
      }}
    />
  );
}

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([8.4657, -13.2317]); // Default: Freetown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        if (onLocationSelect) {
          onLocationSelect(newPos);
        }
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  // Update parent component when position changes
  useEffect(() => {
    if (onLocationSelect) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Select Location
        </label>
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Getting location...' : 'Use My Location'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Click on the map or drag the marker to select a location
      </div>

      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '300px', width: '100%' }}
        className="rounded-lg shadow-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} setPosition={setPosition} />
      </MapContainer>

      <div className="text-xs text-gray-600">
        Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </div>
    </div>
  );
};

export default LocationPicker;
