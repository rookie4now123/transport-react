import React, { useEffect } from 'react';
import TrackMap from '../components/TrackRecord/TrackMap';
import { useReplayStore } from '../helpers/useReplayStore';
export default function Tracks() {
  // This useEffect logic for initialization remains exactly the same.
  // It's the entry point for the feature.
  
  const fetchHistoryLines = useReplayStore((state) => state.fetchHistoryLines);

  useEffect(() => {
    fetchHistoryLines();
    return () => {
    };
  }, [fetchHistoryLines]);

  // The return statement is now much simpler.
  // It just renders the Mymap component, which handles its own internal layout.
  return (
    <TrackMap />
  );
}