
import  { useState, useEffect, useRef } from 'react';
import { Polyline } from 'react-leaflet';
import { useReplayStore } from '../../helpers/useReplayStore';
import { type LatLng } from 'leaflet';
import { gsap } from 'gsap';

export default function AnimatedPolyline() {
  const trackData = useReplayStore((state) => state.trackData);
  
  // Local state to hold the currently visible portion of the path
  const [visiblePath, setVisiblePath] = useState<LatLng[]>([]);
  
  // Ref for the GSAP tween target
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (trackData.length > 0) {
      // When new track data arrives, start the animation
      gsap.to(progressRef.current, {
        value: trackData.length, // Animate from 0 to the full length
        duration: 2, // Animate over 2 seconds
        ease: 'power2.out',
        onUpdate: () => {
          // On each frame, update the visible path
          const currentIndex = Math.floor(progressRef.current.value);
          setVisiblePath(trackData.slice(0, currentIndex).map(p => p.latlng));
        },
        onComplete: () => {
          // Ensure the full path is drawn at the end
          setVisiblePath(trackData.map(p => p.latlng));
        }
      });
    } else {
      // If data is cleared, reset the visible path
      setVisiblePath([]);
    }
  }, [trackData]); // Rerun this effect only when the entire trackData array changes

  if (visiblePath.length === 0) {
    return null;
  }

  return <Polyline pathOptions={{ color: 'blue', weight: 4 }} positions={visiblePath} />;
}