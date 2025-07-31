import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Default center (you can change this to your preferred location)
const defaultCenter = {
  lat: -6.2088, // Jakarta, Indonesia (change as needed)
  lng: 106.8456
};

const GoogleMapsPicker = ({ onLocationSelect, initialLocation }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    const location = { lat, lng };
    setSelectedLocation(location);
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  const handleMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    const location = { lat, lng };
    setSelectedLocation(location);
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  }, [onLocationSelect]);

  return isLoaded ? (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        Click on the map to select your venue location, or drag the marker to adjust.
      </p>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation || defaultCenter}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
      </GoogleMap>
      {selectedLocation && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          <strong>Selected Location:</strong><br />
          Latitude: {selectedLocation.lat.toFixed(6)}<br />
          Longitude: {selectedLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  ) : <div>Loading map...</div>;
};

export default GoogleMapsPicker;
