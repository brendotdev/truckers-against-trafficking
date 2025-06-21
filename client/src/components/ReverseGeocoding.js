import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import backendUrl from '../backendUrl';

const ReverseGeocoding = ({ lng= "-98.5795", lat = "39.8283"}) => {
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      setLoading(true);
      
      fetch(`${backendUrl}/api/geocoding/reverse?lat=${lat}&lng=${lng}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'OK') {
            setLocationName(data.address || 'Location not found');
          } else if (data.error) {
            console.error('Geocoding error:', data.error);
            setLocationName('Location not available');
          }
        })
        .catch((error) => {
          console.error('Error fetching geocoding data:', error);
          setLocationName('Error fetching location');
        })
        .finally(() => setLoading(false));
    }
  }, [lat, lng]);

  return (
    <div>
      <Typography variant='caption'>
        {loading ? 'Loading location...' : locationName}
      </Typography>
    </div>
  );
};

export default ReverseGeocoding;
