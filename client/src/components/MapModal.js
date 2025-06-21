import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import ReverseGeocoding from './ReverseGeocoding'; // Import the new component
import { Typography } from '@material-ui/core';

const containerStyle = {
  width: '100%',
  height: '200px',
};

const center = {
  lat: 40.7128, // Default center point (New York City)
  lng: -74.0060,
};


// Remove hardcoded API key - now handled server-side
const libraries = ['places'];

// Note: GOOGLE_MAPS_API_KEY should be set as environment variable
// For development, create a .env file in the client directory
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

const MapModal = ({ isOpen, onClose, onSelectLocation, setLocation, setSelectedLocation, hideMap }) => {
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false); // State to control map visibility
  // const url = `http://localhost:3005/api/posts/search?longitude=${71.4885}&latitude=${31.186}`

  // console.log('selected value', selected);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
            // You can now use these values in your application
            const response = await fetch(`http://localhost:3005/api/posts/search?longitude=${longitude}&latitude=${latitude}`)
            const data = await response.json();
            console.log(data || 'Data is not fetched');
          },
          (error) => {
            console.error('Error getting location:', error);
            // Handle error appropriately
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Call the function to get the current location
    getCurrentLocation();
  }, [isOpen])

  const handleMapClick = (event) => {
    const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setSelected(newLocation);
    // onSelectLocation(newLocation);
    setSelectedLocation(newLocation);
  };

  const handleSelect = async (value) => {
    setAddress(value);
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setSelected(latLng);
    // onSelectLocation(latLng);
    // setLocation(latLng);
    setSelectedLocation(latLng);
  };

  console.log('selected', selected);

  const darkModeStyles = [
    { elementType: 'geometry', stylers: [{ color: '#212121' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#484848' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#000000' }] },
  ];

  return (
    isOpen ? (
      <div>
        <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
          <div>
            {showMap ? (
              <div style={{ marginLeft: "35px", marginRight: "35px" }}>
                <PlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleSelect}
                  searchOptions={{ types: ['(cities)'] }}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: 'Search for a city',
                          className: 'location-search-input',
                          style: { width: '50%', padding: '13px', marginBottom: '10px', background: "#f9f9f9", border: "none", borderRadius: "10px", outline: "none" }
                        })}
                      />
                      <div>
                        {/* {loading && <div>Loading...</div>} */}
                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                            cursor: 'pointer',
                          };
                          return (
                            <div {...getSuggestionItemProps(suggestion, { style })}>
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                {
                  hideMap ? null :
                    <GoogleMap
                      onLoad={() => setShowMap(true)}
                      mapContainerStyle={containerStyle}
                      center={selected || center}
                      zoom={10}
                      onClick={handleMapClick}
                    // options={{styles: darkModeStyles}}
                    >
                      {selected && <Marker position={selected} />}
                    </GoogleMap>
                }

                {/* Call the ReverseGeocoding component */}
                {selected && (
                  <div style={{ marginTop: "10px", padding: "15px", background: "#fffcee", borderRadius: "10px" }}>
                    {/* <h4>Selected Location:</h4> */}
                    <Typography>Selected Location</Typography>
                    <ReverseGeocoding lat={selected.lat} lng={selected.lng} />
                    {/* <h4>China</h4> */}
                  </div>
                )}
              </div>
            ) : null}

            <button
              onClick={() => setShowMap((prev) => !prev)}
              style={{
                display: 'block',
                margin: '5px auto',
                padding: '10px',
                cursor: 'pointer',
                background: '#fff',
                color: "#f06b72",
                border: '2px solid #f06b72',
                borderRadius: "10px",
                marginTop: "15px"
              }}
              type="button"
            >
              {showMap ? 'Hide Map' : 'Select Location from Google Maps'}
            </button>
          </div>
        </LoadScript>
      </div>
    ) : null
  );
};

export default MapModal;
