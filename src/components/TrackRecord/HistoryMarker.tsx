import React, { useRef, useEffect } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import { useReplayStore } from '../../helpers/useReplayStore';
import L, { type LatLng } from 'leaflet';
import { gsap } from 'gsap'; // 1. Import GSAP

// Your icon definition remains the same
const historyIcon = new L.Icon({
  iconUrl: '/history-bus-icon.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export default function AnimatedHistoryMarker() {
  const trackData = useReplayStore((state) => state.trackData);
  const sliderIndex = useReplayStore((state) => state.sliderIndex);

  // 2. Create a ref to hold the actual Leaflet Marker instance
  const markerRef = useRef<L.Marker | null>(null);

  // 3. This useEffect handles the animation whenever the sliderIndex changes
  useEffect(() => {
    // Ensure we have a marker instance and data to work with
    if (!markerRef.current || !trackData || trackData.length === 0) {
      return;
    }

    const targetPoint = trackData[sliderIndex];
    if (!targetPoint) return;

    // The core of the animation logic
    gsap.to(
      // GSAP animates plain objects, so we get the current lat/lng
      markerRef.current.getLatLng(), 
      {
        // And we animate TO the target lat/lng
        lat: targetPoint.latlng.lat,
        lng: targetPoint.latlng.lng,
        duration: 0.5, // Animation duration in seconds
        ease: 'power1.inOut', // A nice easing function for smooth start/end
        
        // This function runs on every frame of the animation
        onUpdate: function () {
          // 'this.targets()[0]' is the object being animated (the LatLng object)
          markerRef.current?.setLatLng(this.targets()[0]);
        },
      }
    );
  }, [sliderIndex, trackData]); // Rerun effect if slider or the whole track changes

  // Guard clause: If there's no data, render nothing.
  if (!trackData || trackData.length === 0) {
    return null;
  }
  
  const pathPositions: LatLng[] = trackData.map(point => point.latlng);
  const initialPoint = trackData[0]; // The marker's initial position

  return (
    <>
      <Polyline pathOptions={{ color: 'blue' }} positions={pathPositions} />

      {/* 
        Render the marker only ONCE at the initial position.
        GSAP will take over moving it from now on.
        We attach the ref here.
      */}
      <Marker ref={markerRef} position={initialPoint.latlng}>
        <Popup>
          I am an animated marker!
        </Popup>
      </Marker>
    </>
  );
}