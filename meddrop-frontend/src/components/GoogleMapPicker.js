import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GoogleMapPicker = ({
  apiKey,
  initialLocation,
  onLocationChange,
  defaultCenter = { lat: 12.91285, lng: 74.85603 }
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places']
  });

  const mapRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState(initialLocation || null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const onMapLoad = (map) => {
    mapRef.current = map;
    if (markerPosition) {
      map.setCenter(markerPosition);
    }
  };

  const onMapClick = (event) => {
    const latLng = event.latLng;
    setMarkerPosition({
      lat: latLng.lat(),
      lng: latLng.lng()
    });
    onLocationChange && onLocationChange({
      lat: latLng.lat(),
      lng: latLng.lng()
    });
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const latLng = place.geometry.location;
        setMarkerPosition({
          lat: latLng.lat(),
          lng: latLng.lng()
        });
        onLocationChange && onLocationChange({
          lat: latLng.lat(),
          lng: latLng.lng()
        });
        if (mapRef.current) {
          mapRef.current.setCenter(latLng);
          mapRef.current.setZoom(15);
        }
      }
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search for location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={(input) => {
            if (input && !autocomplete) {
              const autoComplete = new window.google.maps.places.Autocomplete(input);
              autoComplete.addListener('place_changed', onPlaceChanged);
              setAutocomplete(autoComplete);
            }
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      <div
        ref={mapRef}
        onClick={onMapLoad}
        style={{ width: '100%', height: '300px' }}
      >
        {markerPosition && (
          <Marker
            position={{ lat: markerPosition.lat, lng: markerPosition.lng }}
            draggable
          />
        )}
      </div>
    </div>
  );
};

export default GoogleMapPicker;