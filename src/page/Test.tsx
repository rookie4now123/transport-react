import { useState, useEffect } from "react";
import { useCrud } from "../hooks/useractions"; // Adjust path to your hook file
import { type Station } from "../helpers/interfaces";
// Define an interface for what a Station object looks like

export default function Test() {
  // 1. Get the 'get' function from our hook
  const { get } = useCrud();

  // 2. Manage state within the component, NOT in the hook
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 3. Define an async function to fetch data
    const fetchStations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedStations = await get<Station[]>("station/"); // e.g., GET /api/station/
        // Let the component decide what to do with the data
        setStations(fetchedStations);
      } catch (err) {
        // The component handles the error state
        setError("Failed to fetch stations. Please try again later.");
        console.error(err);
      } finally {
        // The component handles the loading state
        setIsLoading(false);
      }
    };

    fetchStations();
  }, [get]); // Dependency array includes 'get'

  // 4. Render UI based on the component's state
  if (isLoading) {
    return <div>Loading stations...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Stations</h1>
      <ul>
        {stations.map((station) => (
  <li key={station.id}>
  {station.station_name} - ({station.location.latitude}, {station.location.longitude})
</li>
        ))}
      </ul>
    </div>
  );
};