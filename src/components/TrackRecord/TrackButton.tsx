import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useReplayStore } from '../../helpers/useReplayStore';
import { useEffect } from 'react';
export default function TrackButton() {
    const fetchTrackForDisplay = useReplayStore((state) => state.fetchTrackForDisplay);
    const isLoading = useReplayStore((state) => state.isLoading);
    const trackdata = useReplayStore((state) => state.trackData);

    useEffect(() => {
        if (!isLoading && trackdata.length > 0) {
            console.log("SUCCESS: Data has arrived in the store:", trackdata);
        }
    }, [trackdata, isLoading]);

    function handleClick() {
      fetchTrackForDisplay();
    }
  return (

      <Button variant="contained" 
      onClick={handleClick}
      loading={isLoading}
      loadingPosition="end"
      endIcon={<SendIcon />}>
        {isLoading ? 'Loading...' : 'Start'}
      </Button>
 
  );
}