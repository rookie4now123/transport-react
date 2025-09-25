import React, { useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useTrackingStore } from '../../helpers/trackingStore';
import L from 'leaflet';

const vehicleIcon = new L.Icon({
    iconUrl: '/bus-icon.png',
    iconSize: [35, 35],
  });

  import { AnimatedLiveMarker } from './AnimatedLiveMarker';

  export default function LiveMarkers() {
    // State subscription remains the same
    const locations = useTrackingStore((state) => state.locations);
    const selectedLines = useTrackingStore((state) => state.selectedLines);
  
    // Filtering logic remains the same
    const visibleMarkers = Object.values(locations).filter(loc =>
      selectedLines.includes(loc.route_name)
    );
  
    // 2. The mapping logic now renders our new component
    return (
      <>
        {visibleMarkers.map((location) => (
          // For each visible location, render an AnimatedLiveMarker.
          // The 'key' is crucial for React to efficiently update the correct component instance.
          <AnimatedLiveMarker key={location.run_id} location={location} />
        ))}
      </>
    );
  }