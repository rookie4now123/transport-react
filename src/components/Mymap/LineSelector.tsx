import { useTrackingStore } from '../../helpers/trackingStore';
import { FormControl, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material';

export default function LineSelector() {
    // Subscribe to the specific pieces of state and actions needed
    const lines = useTrackingStore((state) => state.lines);
    const selectedLines = useTrackingStore((state) => state.selectedLines);
    const toggleLineSelection = useTrackingStore((state) => state.toggleLineSelection);
    const liveLineNames = useTrackingStore((state) => state.liveLineNames);

    return (
      <FormControl sx={{ m: 1, width: 300, background: 'white' }}>
        <Select
          multiple
          displayEmpty
          value={selectedLines}
          input={<OutlinedInput />}
          renderValue={() => {
            return `${liveLineNames.size} / ${lines.length} selected`;
          }}
        >
       {lines.map((line) => {
          const isLive = liveLineNames.has(line.route_name);

          return (
            <MenuItem
              key={line.id}
              value={line.route_name}
              // 2. The onClick handler is now very simple. It just reports the click.
              onClick={() => toggleLineSelection(line.route_name)}
            >
              <Checkbox checked={selectedLines.includes(line.route_name)} />
              <ListItemText 
                primary={line.route_name}
                sx={{ color: isLive ? 'green' : 'red' }} 
              />
            </MenuItem>
          );
        })}
        </Select>
      </FormControl>
    );
  }