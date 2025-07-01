import { useTrackingStore } from '../../helpers/trackingStore';
import { FormControl, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material';

export default function LineSelector() {
    // Subscribe to the specific pieces of state and actions needed
    const lines = useTrackingStore((state) => state.lines);
    const selectedLines = useTrackingStore((state) => state.selectedLines);
    const toggleLineSelection = useTrackingStore((state) => state.toggleLineSelection);
  
    return (
      <FormControl sx={{ m: 1, width: 300, background: 'white' }}>
        <Select
          multiple
          displayEmpty
          value={selectedLines}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            return `${selected.length} / ${lines.length} selected`;
          }}
        >
          {lines.map((line) => (
            <MenuItem
              key={line.id}
              value={line.route_name}
              // Use our store action on click for better control
              onClick={() => toggleLineSelection(line.route_name)}
            >
              <Checkbox checked={selectedLines.includes(line.route_name)} />
              <ListItemText primary={line.route_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }