import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const GOOGLE_API_KEY = "AIzaSyAAJAUvh2hvBMydnZair17Z9Xwq4cx-QZI";

const ReverseGeocoding = ({ lng= "-98.5795", lat = "39.8283"}) => {
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (lat && lng) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

      // Fetch the location name based on latitude and longitude
      fetch(geocodeUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'OK') {
            const address = data.results[0]?.formatted_address;
            console.log('Address:', address);
            setLocationName(address || 'Location not found');
          } else {
            console.error('Geocoding API status error:', data.status);
            setLocationName('Location not found');
          }
        })
        .catch((error) => {
          console.error('Error fetching geocoding data:', error);
          setLocationName('Error fetching location');
        });
    }
  }, [lat, lng]);

  return (
    <div>
      {/* <h3>Location Name:</h3> */}
      {/* <p>{locationName}</p> */}
      <Typography variant='caption'>{locationName}</Typography>
    </div>
  );
};

export default ReverseGeocoding;
