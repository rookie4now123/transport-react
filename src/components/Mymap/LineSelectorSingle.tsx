import { useState, useEffect} from 'react';
import { useTrackingStore } from '../../helpers/trackingStore';
import { FormControl, Select, OutlinedInput, 
    MenuItem, Checkbox, ListItemText,
    Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import { useCrud } from '../../hooks/useractions';
import { baseURL, type Lines } from '../../helpers/interfaces';

export default function LineSelector() {
    // Subscribe to the specific pieces of state and actions needed

    const [lines, setLines] = useState<Lines[]>([]);
    const [selectedLine, setSelectedLine] = useState<string[]>([]);
    const liveLineNames = useTrackingStore((state) => state.liveLineNames);

    const {get} = useCrud()

      useEffect(() => {
    // 3. Define an async function to fetch data
    const fetchlines = async () => {
      try {
        const fetchedlines = await get<Lines[]>("route/"); // e.g., GET /api/lines/
        setLines(fetchedlines);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
    fetchlines();
  }, []); // Dependency array includes 'get'

    return (
      <FormControl sx={{ m: 1, width: 200, background: 'white' }}>
        <Select
          multiple
          displayEmpty
          value={selectedLine}
          input={<OutlinedInput />}
          renderValue={() => {
            return selectedLine ? `Selected: ${selectedLine}` : "/ Select a line";
          }}
        >
      <RadioGroup 
        value={selectedLine}
      >
        {lines.map((line) => {
          const isLive = liveLineNames.has(line.route_name);

          return (
            <MenuItem key={line.id} dense>
              <FormControlLabel
                value={line.route_name}
                control={<Radio />}
                label={
                  <ListItemText 
                    primary={line.route_name}
                    sx={{ color: isLive ? 'green' : 'red' }} 
                  />
                }
                sx={{ width: '100%', m: 0 }}
              />
            </MenuItem>
          );
        })}
      </RadioGroup>
    </Select>
      </FormControl>
    );
  }