// import React, { useState, useEffect } from 'react';
// import { baseURL } from '../helpers/interfaces';
// // The URL of your SSE endpoint

// export interface LocationData {
//   route_id: string;
//   route_name: string;
//   monitor_name: string;
//   run_id: string; // The UUID of the RouteRun
//   latitude: number;
//   longitude: number;
//   timestamp: string; // The ISO 8601 timestamp string
// }
// export default function Tracks() {

//   const [locations, setLocations] = useState<Record<string, LocationData>>({});

//   useEffect(() => {
//     const eventSource = new EventSource(`${baseURL}/location-stream/`, { withCredentials: true });
//     eventSource.onmessage = (event) => {
//       const newLocationData: LocationData = JSON.parse(event.data);
//       console.log('Received location update:', newLocationData);

//       // Update the state with the new location data.
//       // We use the functional form of setState to get the previous state.
//       setLocations(prevLocations => ({
//         ...prevLocations,
//         [newLocationData.route_id]: newLocationData, // Add or update the location for this specific run
//       }));
//     };

//     // 3. Define the event listener for errors.
//     eventSource.onerror = (error) => {
//       console.error('SSE Error:', error);
//       eventSource.close();
//       // If the connection is closed by the server, it might show up here.
//       // The browser will automatically try to reconnect.
//       // You might want to add logic here to stop retrying after a certain number of failures.
//     };

//     // 4. Return a cleanup function.
//     // This function will be called when the component unmounts.
//     return () => {
//       console.log('Closing SSE connection.');
//       eventSource.close();
//     };
//   }, []); // The empty dependency array [] ensures this effect runs only once when the component mounts.
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       const STALE_THRESHOLD_MS = 120000; // 2 minutes
//       setLocations(prevRoutes => {
//         const stillActiveRoutes: Record<string, LocationData> = {};
//         let hasChanged = false;

//         for (const routeId in prevRoutes) {
//           const location = prevRoutes[routeId];
//           const lastUpdate = new Date(location.timestamp).getTime();

//           if (now - lastUpdate < STALE_THRESHOLD_MS) {
//             stillActiveRoutes[routeId] = location;
//           } else {
//             console.log(`Removing stale route: ${location.route_name}`);
//             hasChanged = true;
//           }
//         }
        
//         return hasChanged ? stillActiveRoutes : prevRoutes;
//       });
//     }, 3000); // Check every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div>
//       <h1>Live Monitor Dashboard</h1>
//       {Object.keys(locations).length === 0 ? (
//         <p>Waiting for location updates...</p>
//       ) : (
//         <ul>
//           {/* Map over the location data and display it */}
//           {Object.values(locations).map((location) => (
//             <li key={location.route_id}>
//               <strong>Route_Name:</strong> {location.route_name}... <br />
//               <strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} <br />
//               <strong>Last Update:</strong> {new Date(location.timestamp).toLocaleTimeString()}<br />
//               <strong>Monitor_Name:</strong> {location.monitor_name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import LineSelector from '../components/Mymap/LineSelectorSingle';
import { Box } from '@mui/material';

export default function Tracks() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
    <div>
        <LineSelector />
      </div>
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="topright" />    
  {/* This component will render all the markers based on the store's state */}

    </MapContainer>

    </Box>
  );
}