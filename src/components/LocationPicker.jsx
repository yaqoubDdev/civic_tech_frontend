import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Component to recenter map when position changes
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}


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
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      draggable={draggable}
      position={position}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
        },
      }}
    />
  );
}

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([8.485488, -13.226863]); // Default: Freetown
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]); // Only depend on position, not onLocationSelect

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Select Location</Label>
        <Button
          onClick={getCurrentLocation}
          disabled={loading}
          variant="secondary"
          size="sm"
        >
          {loading ? 'Getting location...' : 'Use My Location'}
        </Button>
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
        <RecenterMap position={position} />
        <DraggableMarker position={position} setPosition={setPosition} />
      </MapContainer>

      <div className="text-xs text-gray-600">
        Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </div>
    </div>
  );
};

export default LocationPicker;
