
import React, { useRef, useEffect, useState } from 'react'; // 1. Import useState
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { gsap } from 'gsap';
import { type LocationData } from '../../helpers/interfaces';

// ... (your vehicleIcon definition)

interface AnimatedLiveMarkerProps {
  location: LocationData;
}

export const AnimatedLiveMarker: React.FC<AnimatedLiveMarkerProps> = ({ location }) => {
  const markerRef = useRef<L.Marker | null>(null);

  // 2. Use state to store the INITIAL position.
  // This value will be set only once when the component mounts.
  const [initialPosition, setInitialPosition] = useState<[number, number] | null>(null);

  const { latitude, longitude } = location;

  useEffect(() => {
    // 3. On the very first render, set the initial position and do nothing else.
    if (!initialPosition) {
      setInitialPosition([latitude, longitude]);
      return;
    }

    // 4. On subsequent renders, animate from the current position to the new one.
    // Ensure the marker instance exists before trying to animate.
    if (markerRef.current) {
      gsap.to(
        markerRef.current.getLatLng(),
        {
          lat: latitude,
          lng: longitude,
          duration: 5,
          ease: 'power1.out',
          onUpdate: function() {
            // This imperatively updates the marker's position on the map
            // without causing a React re-render of the Marker component itself.
            markerRef.current?.setLatLng(this.targets()[0]);
          },
        }
      );
    }
  }, [latitude, longitude, initialPosition]); // The dependency array is correct

  // 5. If we don't have an initial position yet, render nothing.
  // This prevents the marker from briefly appearing at [0,0] or erroring.
  if (!initialPosition) {
    return null;
  }
  
  return (
    // 6. CRUCIAL: The 'position' prop is now ALWAYS set to the 'initialPosition'.
    // It never changes, so React never teleports the marker.
    // GSAP is now in full control of the movement.
    <Marker
      ref={markerRef}
      position={initialPosition} 
      // icon={vehicleIcon}
    >
      <Popup>
        <strong>{location.route_name}</strong><br />
        Monitored by: {location.monitor_name}<br />
        Last Update: {new Date(location.timestamp).toLocaleTimeString()}
      </Popup>
    </Marker>
  );
};