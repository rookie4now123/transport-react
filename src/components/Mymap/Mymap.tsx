import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import LiveMarkers from './LiveMarkers'; // Import the markers component
import LineSelector from './LineSelector';
import { Box } from '@mui/material';
import MapFlyToController from './MapFlyToController';
export default function Mymap() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
    <div>
        <LineSelector />
      </div>
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />    
  {/* This component will render all the markers based on the store's state */}
      <LiveMarkers />
      <MapFlyToController />
    </MapContainer>

    </Box>
  );
}