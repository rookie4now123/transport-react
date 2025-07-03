import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useTrackingStore } from '../../helpers/trackingStore';

type Props = {
    maxZoom?: number;
  };

export default function MapFlyToController({maxZoom = 12}: Props) {
  // Get the leaflet map instance
  const map = useMap();

  // Subscribe to the "signal" state and the "reset" action from our store
  const flyToLocation = useTrackingStore((state) => state.flyToLocation);
  const clearFlyToLocation = useTrackingStore((state) => state.clearFlyToLocation);

  // This effect runs whenever the 'flyToLocation' signal changes
  useEffect(() => {
    if (flyToLocation) {
      const zoom = map.getZoom() > maxZoom ? maxZoom : map.getZoom(); // Zoom in if we are far out
      map.flyTo(flyToLocation, zoom);

      // IMPORTANT: Reset the signal in the store after we've used it.
      // This prevents the map from flying again on every re-render.
      clearFlyToLocation();
    }
  }, [flyToLocation, map, clearFlyToLocation]);

  // This component does not render anything
  return null;
}