import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useReplayStore } from '../../helpers/useReplayStore';
import { Typography } from '@mui/material';
import { shallow } from 'zustand/shallow';

export default function TrackSlider() {

    const trackData = useReplayStore((state) => state.trackData);
    const sliderIndex = useReplayStore((state) => state.sliderIndex);
    const setSliderIndex = useReplayStore((state) => state.setSliderIndex);
    const isSliderDisabled = trackData.length === 0;
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderIndex(newValue as number);
      };

      const formatLabel = (value: number): string => {
        const point = trackData[value];
        if (point && point.timestamp) {
            return new Date(point.timestamp).toLocaleTimeString();
        }
        return '';
      };
      return (
        <Box sx={{ width: 400, padding: '0 16px' }}>
          <Typography gutterBottom>Track Playback</Typography>
          <Slider
            value={sliderIndex}
            onChange={handleSliderChange}
            disabled={isSliderDisabled}
            min={0}
            max={isSliderDisabled ? 0 : trackData.length - 1}
            aria-label="Track Playback Slider"
            valueLabelDisplay="auto"
            valueLabelFormat={formatLabel}
          />
        </Box>
      );
}