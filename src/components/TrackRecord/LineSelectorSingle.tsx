import { useState, useEffect} from 'react';
import { useReplayStore } from '../../helpers/useReplayStore';
import { FormControl, Select, OutlinedInput, 
    MenuItem, ListItemText,  type SelectChangeEvent,
    Radio, RadioGroup, FormControlLabel, InputLabel,
} from '@mui/material';


export default function LineSelectorSingle() {
  // 1. Get the state and the action from the store
  const lines = useReplayStore((state) => state.historylines);
  const selectedRoute = useReplayStore((state) => state.selectedRoute);
  const setSelectedRoute = useReplayStore((state) => state.setSelectedRoute);

  // 2. Define the handler that will call the store's action
  const handleChange = (event: SelectChangeEvent<string>) => {
    // Get the selected route name from the event
    const newSelectedRoute = event.target.value;
    // Call the action from your Zustand store to update the global state
    setSelectedRoute(newSelectedRoute);
  };

  return (
    <FormControl sx={{ m: 1, width: 250, background: 'white' }}>
      <InputLabel id="route-select-label">Select a Route</InputLabel>
      <Select
        labelId="route-select-label"
        id="route-select"
        value={selectedRoute || ''}
        label="Select a Route"
        onChange={handleChange} // 4. Connect the handler here
      >
        {/* 5. Map over the lines to create a MenuItem for each one */}
        {lines.map((line) => (
          <MenuItem key={line.id} value={line.route_name}>
            {line.route_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}