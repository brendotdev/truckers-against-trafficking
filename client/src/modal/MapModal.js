import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import ReverseGeocoding from '../components/ReverseGeocoding';
import { Typography } from '@material-ui/core';

const containerStyle = {
  width: '100%',
  height: '200px',
};

const defaultCenter = {
  lat: 40.7128, // Default center point (New York City)
  lng: -74.0060,
};

const GOOGLE_API_KEY = "AIzaSyAAJAUvh2hvBMydnZair17Z9Xwq4cx-QZI";
const libraries = ['places'];

const MapModal = ({ isOpen, onClose, onSelectLocation, hideMap }) => {
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null); // Default is null to check if it's loaded

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  console.log('Map Modal Current', currentLocation);

  const handleMapClick = (event) => {
    const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setSelected(newLocation);
    onSelectLocation(newLocation);
  };

  const handleSelect = async (value) => {
    setAddress(value);
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    
    setSelected(latLng);
    onSelectLocation(latLng);
  };

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
                          style: { width: '50%', padding: '13px', marginBottom: '10px', background: "#f9f9f9", border:"none", borderRadius: "10px", outline: "none" }
                        })}
                      />
                      <div>
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

                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={currentLocation || defaultCenter} // Center on user location if available, else default
                  zoom={currentLocation ? 14 : 10}
                  onClick={handleMapClick}
                >
                  {selected && <Marker position={selected} />}
                  {currentLocation && <Marker position={currentLocation} label="You are here" />} {/* Mark user's location */}
                </GoogleMap>

                {selected && (
                  <div style={{ marginTop: "10px", padding: "15px", background: "#fffcee", borderRadius: "10px" }}>
                    <Typography>Selected Location</Typography>
                    <ReverseGeocoding lat={selected.lat} lng={selected.lng} />
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
