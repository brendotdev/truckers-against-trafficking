// locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedLocation: null, // Store selected location
  locationName: '',       // Store the location name (address)
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.selectedLocation = action.payload.location;
      state.locationName = action.payload.locationName; // Update the location name
    },
    clearLocation: (state) => {
      state.selectedLocation = null;
      state.locationName = '';
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
