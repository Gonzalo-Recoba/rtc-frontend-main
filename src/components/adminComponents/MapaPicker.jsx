import React, {useCallback, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';

const MapaPicker = ({selectedPosition, setSelectedPosition, setAddress, setLocalidad}) => {
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const geocodeLatLng = (lat, lng) => {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };
  
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            setAddress(results[0].formatted_address);
            setLocalidad(results[0].address_components[2].long_name);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    };

    setSelectedPosition({ lat, lng });
    geocodeLatLng(lat, lng);
  }, [setAddress, setLocalidad, setSelectedPosition]);


  return (
    <LoadScript 
      googleMapsApiKey={import .meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '200px' }}
        center={selectedPosition ? { lat: selectedPosition.lat, lng: selectedPosition.lng } :  { lat: -34.603961, lng: -58.513433}}
        zoom={15}
        onClick={onMapClick}
      >
        {selectedPosition && (
          <Marker position={selectedPosition} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapaPicker;


/*
  

*/