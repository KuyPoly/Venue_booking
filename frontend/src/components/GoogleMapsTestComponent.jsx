// Google Maps Integration Test
import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

const defaultCenter = {
  lat: 11.5564, // Phnom Penh, Cambodia
  lng: 104.9282
};

const GoogleMapsTestComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div>
      <h3>Google Maps Test</h3>
      <p>API Key: {process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Loaded' : 'Missing'}</p>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={15}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapsTestComponent;
