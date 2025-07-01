import { useState, useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { useCrud } from "../hooks/useractions"; // Adjust path to your hook file
import { type Lines } from "../helpers/interfaces";
// Define an interface for what a lines object looks like

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Test() {
  // 1. Get the 'get' function from our hook
  const { get } = useCrud();

  // 2. Manage state within the component, NOT in the hook
  const [lines, setLines] = useState<Lines[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 3. Define an async function to fetch data
    const fetchlines = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedlines = await get<Lines[]>("route/"); // e.g., GET /api/lines/
        // Let the component decide what to do with the data
        setLines(fetchedlines);
      } catch (err) {
        setError("Failed to fetch lines. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchlines();
  }, []); // Dependency array includes 'get'

  const handleItemClick = (clickedRouteName: string) => {
    console.log(`${clickedRouteName}`);
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedLines(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  if (isLoading) {
    return <div>Loading lines...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <Select
          displayEmpty
          multiple
          value={selectedLines}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
          return <em>aaaaa {selected.length} / {lines.length} selected</em>;
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          {lines.map((lines) => (
            <MenuItem key={lines.id} value={lines.route_name}
            onClick={() => handleItemClick(lines.route_name)}
            >
              <Checkbox checked={selectedLines.includes(lines.route_name)} />
              <em>Placeholder111</em>
              <ListItemText primary={lines.route_name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
