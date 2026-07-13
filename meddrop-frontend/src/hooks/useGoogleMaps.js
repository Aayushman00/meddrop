import { useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const useGoogleMaps = (apiKey, libraries = ['places']) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: libraries
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    const latLng = event.latLng;
    setMarkerPosition({
      lat: latLng.lat(),
      lng: latLng.lng()
    });
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const latLng = place.geometry.location;
        setMarkerPosition({
          lat: latLng.lat(),
          lng: latLng.lng()
        });
        if (map) {
          map.setCenter(latLng);
          map.setZoom(15);
        }
      }
    }
  }, [autocomplete, map]);

  return {
    isLoaded,
    loadError,
    map,
    setMap: onMapLoad,
    markerPosition,
    setMarkerPosition,
    autocomplete,
    setAutocomplete,
    onMarkerDragEnd,
    onPlaceChanged
  };
};

export default useGoogleMaps;