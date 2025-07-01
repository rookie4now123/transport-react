import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useTrackingStore } from '../../helpers/trackingStore';
import L from 'leaflet';

const vehicleIcon = new L.Icon({
    iconUrl: '/bus-icon.png',
    iconSize: [35, 35],
  });

export default function LiveMarkers() {
    // Subscribe to the state needed for filtering and rendering
    const locations = useTrackingStore((state) => state.locations);
    const selectedLines = useTrackingStore((state) => state.selectedLines);
  
    // Filter the live locations to only include ones the user has selected
    const visibleMarkers = Object.values(locations).filter(loc => 
      selectedLines.includes(loc.route_name)
    );
  
    return (
      <>
        {visibleMarkers.map((location) => (
          <Marker
            key={location.run_id} // A run_id is likely more unique than route_id
            position={[location.latitude, location.longitude]}
            // icon={vehicleIcon}
          >
            <Popup>
              <strong>{location.route_name}</strong><br />
              Monitored by: {location.monitor_name}<br />
              Last Update: {new Date(location.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </>
    );
  }