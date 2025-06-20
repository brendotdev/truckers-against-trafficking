import React, { useState } from 'react';
import SubForm from './SubForm';
import { DialogTitle } from './CustomDialogTitle';
import {
  Dialog,
  DialogContent,
  Button,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import { useDialogStyles } from '../styles/muiStyles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MapModal from '../components/MapModal';
// import ReverseGeocoding from './ReverseGeocoding';

const GOOGLE_API_KEY = "AIzaSyAAJAUvh2hvBMydnZair17Z9Xwq4cx-QZI";

const SubFormModal = ({ type, handleCloseMenu }) => {
  const classes = useDialogStyles();
  const [open, setOpen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(true); // Always show the MapModal when the dialog opens
  const [selectedLocation, setSelectedLocation] = useState(null); // Store selected location (address)
  const [locationName, setLocationName] = useState(''); // Store the reverse geocoded address

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMenu = () => {
    handleClickOpen();
    handleCloseMenu();
  };

  // Function to handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    fetchAddress(location?.lat, location.lng); // Call reverse geocoding to get the address
    setShowMapModal(false); // Close MapModal after selecting a location
  };

  // Reverse geocode to get the address from lat/lng
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const address = data.results[0]?.formatted_address || 'Location not found';
        setLocationName(address);
      } else {
        setLocationName('Location not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setLocationName('Error fetching location');
    }
  };

  return (
    <div>
      {type !== 'menu' ? (
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpen}
          fullWidth
          className={classes.createSubBtn}
          size="large"
          startIcon={<AddCircleIcon />}
        >
          Create New Group
        </Button>
      ) : (
        <MenuItem onClick={handleOpenMenu}>
          <ListItemIcon>
            <AddCircleIcon style={{ marginRight: 7 }} />
            Create Subreddish
          </ListItemIcon>
        </MenuItem>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        classes={{ paper: classes.dialogWrapper }}
        fullWidth
      >
        <DialogTitle onClose={handleClose}>Create a new group</DialogTitle>
        <DialogContent
          style={{
            maxHeight: '400px', // Adjust the maxHeight as needed
            overflowY: 'auto', // Enable scrolling when content exceeds maxHeight
          }}
        >
          {/* Automatically show the MapModal */}
          {showMapModal && (
            <MapModal
              isOpen={showMapModal}
              onSelectLocation={handleLocationSelect} // Handle location selection from MapModal
              onClose={() => setShowMapModal(false)} // Allow closing the MapModal
              setSelectedLocation={setSelectedLocation}
            />
          )}

          {/* Display selected location address (if any) */}
          {locationName && (
            <div>
              {/* <h4>Selected Location:</h4> */}
              {/* <p>{locationName}</p> */}
              {/* <ReverseGeocoding /> */}
              <Typography>Selected Location:</Typography>
              <Typography variant="caption">{locationName}</Typography>
            </div>
          )}

          {/* Render SubForm and pass the selectedLocation if needed */}
          <SubForm location={selectedLocation} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubFormModal;
