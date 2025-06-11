import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Typography } from '@material-ui/core';
import { usePostListStyles } from '../styles/muiStyles';

const GOOGLE_API_KEY = "AIzaSyAAJAUvh2hvBMydnZair17Z9Xwq4cx-QZI";
const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '480px',
  borderRadius: '10px',
};

const ModalList = () => {
  const [usersData, setUserData] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef(null);
  const classes = usePostListStyles();

  const handleMarkerHover = (person) => {
    clearTimeout(hoverTimeout.current);
    setIsHovered(true);
    setSelectedPerson(person);
  };

  const handleMarkerHoverOut = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
      setSelectedPerson(null);
    }, 300);
  };

  const handleInfoWindowEnter = () => {
    clearTimeout(hoverTimeout.current);
  };

  const handleInfoWindowLeave = () => {
    setIsHovered(false);
    setSelectedPerson(null);
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));

            const response = await fetch(`http://localhost:3005/api/posts/search?longitude=${longitude}&latitude=${latitude}`);
            const data = await response.json();
            setUserData(data.results);
            console.log(data || 'Data is not fetched');
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getCurrentLocation();

    // Cleanup function
    return () => {
      clearTimeout(hoverTimeout.current); // Clear the hover timeout if the component unmounts
      // Optionally reset state or clean up other resources here
    };
  }, []);

  return (
    <div className={classes.root}>
      <div>
        <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={10}
            options={{ disableDefaultUI: true }}
          >
            <Marker
              position={currentLocation}
              title="You are here"
            />

            {usersData.map((person) => (
              <Marker
                key={person.id}
                position={{
                  lat: person.location.coordinates[1],
                  lng: person.location.coordinates[0],
                }}
                onMouseOver={() => handleMarkerHover(person)}
                onMouseOut={handleMarkerHoverOut}
                cursor="pointer"
              />
            ))}

            {selectedPerson && isHovered && (
              <InfoWindow
                position={{
                  lat: selectedPerson.location.coordinates[1] + 0.010,
                  lng: selectedPerson.location.coordinates[0],
                }}
                options={{ disableAutoPan: true }}
                onMouseEnter={handleInfoWindowEnter}
                onMouseLeave={handleInfoWindowLeave}
              >
                <div style={{ backgroundColor: '#eee', padding: '10px', borderRadius: '8px', maxWidth: '200px' }}>
                  <Typography variant="h6">{selectedPerson.author.username}</Typography>
                  <Typography variant="body2">{selectedPerson.textSubmission}</Typography>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default ModalList;
