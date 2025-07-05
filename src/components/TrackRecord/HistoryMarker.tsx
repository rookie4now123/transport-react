import React from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import { useReplayStore } from '../../helpers/useReplayStore';
import L, { type LatLng }  from 'leaflet';

// (Optional but recommended) Define a custom icon for the historical marker
const historyIcon = new L.Icon({
  iconUrl: '/history-bus-icon.png', // A different icon to distinguish it
  iconSize: [35, 35],
});

export default function HistoryMarker() {
  // 1. Subscribe to the correct store: useReplayStore
  const trackData = useReplayStore((state) => state.trackData);
  const sliderIndex = useReplayStore((state) => state.sliderIndex);

  const currentPoint = trackData && trackData.length > 0 ? trackData[sliderIndex] : null;
  // 2. Add a guard clause: If there's no track data, render nothing.
  if (!trackData || trackData.length === 0) {
    return null;
  }

  const pathPositions: LatLng[] = trackData.map(point => point.latlng);
  
  // The single current point for the Marker

  return (
    <>
      {/* 4. Draw the entire path of the track */}
      <Polyline pathOptions={{ color: 'blue' }} positions={pathPositions} />

      {/* 5. Draw the single, moving marker if the current point exists */}
      {currentPoint && (
        <Marker
        position={currentPoint.latlng}
        >
          <Popup>
          <strong>Position at:</strong><br />
            {currentPoint.timestamp 
              ? new Date(currentPoint.timestamp).toLocaleTimeString() 
              : 'Time not available'}
              </Popup>
        </Marker>
      )}
    </>
  );
}