import React, { useEffect } from 'react';
import { useTrackingStore } from '../helpers/trackingStore';
import Mymap from '../components/Mymap/Mymap';
export default function TrackingDashboard() {
  // This useEffect logic for initialization remains exactly the same.
  // It's the entry point for the feature.
  const fetchLines = useTrackingStore((state) => state.fetchLines);
  const initSse = useTrackingStore((state) => state.initSse);
  const closeSse = useTrackingStore((state) => state.closeSse);
  const updateAndCleanLiveStatus = useTrackingStore((state) => state.updateAndCleanLiveStatus);

  useEffect(() => {
    fetchLines();
    initSse();

    const liveStatusInterval = setInterval(updateAndCleanLiveStatus, 30000);

    return () => {
      closeSse();
      clearInterval(liveStatusInterval);
    };
  }, [fetchLines, initSse, closeSse, updateAndCleanLiveStatus]);

  // The return statement is now much simpler.
  // It just renders the Mymap component, which handles its own internal layout.
  return (
    <Mymap />
  );
}