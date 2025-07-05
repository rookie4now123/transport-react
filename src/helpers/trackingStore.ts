import {create} from 'zustand';
import axiosService from './axios';
import { 
    type TrackingState,
    type TrackingActions,
    type Lines,
    type LocationData, baseURL, type LatLngTuple
 } from './interfaces';

 export const useTrackingStore = create<TrackingState & TrackingActions>((set, get) => ({
    // --- Initial State ---
    lines: [],
    selectedLines: [],
    locations: {},
    sseConnection: null,
    flyToLocation: null,
    liveLineNames: new Set(),
    
    // --- Actions ---
  
    // 2. Corrected `fetchLines` action
    fetchLines: async () => {
      try {
        const response = await axiosService.get<Lines[]>(`${baseURL}/route/`);
        set({ lines: response.data });
      } catch (error) {
        console.error("Failed to fetch lines:", error);
      }
    },
  
    // This action was already correct
    toggleLineSelection: (lineName: string) => {
        const { locations, selectedLines } = get(); 
        const isCurrentlySelected = selectedLines.includes(lineName);
        let newFlyToLocation: LatLngTuple | null = null;

        if (!isCurrentlySelected) {
            const locationData = Object.values(locations).find(
              (loc) => loc.route_name === lineName
            );
            if (locationData) {
              newFlyToLocation = [locationData.latitude, locationData.longitude];
              console.log(newFlyToLocation)
            }
          }
      set(state => {
        const selected = new Set(state.selectedLines);
        if (selected.has(lineName)) {
          selected.delete(lineName);
        } else {
          selected.add(lineName);
        }
        return { 
            selectedLines: Array.from(selected),
            flyToLocation: newFlyToLocation };
      });
    },

    clearFlyToLocation: () => {
        set({ flyToLocation: null });
      },
  
    // This action was already correct
    initSse: () => {
      if (get().sseConnection) return;
      const SSE_URL = `${baseURL}/location-stream/`;
      const eventSource = new EventSource(SSE_URL, { withCredentials: true });

      eventSource.onmessage = (event) => {
        const newLocation: LocationData = JSON.parse(event.data);
        
        set(state => {
            const newLiveNames  = new Set(state.liveLineNames);
            newLiveNames.add(newLocation.route_name);
            return {
                // Update the specific location data
                locations: {
                  ...state.locations,
                  [newLocation.route_id]: newLocation,
                },
                // Update the set of live names IMMEDIATELY
                liveLineNames: newLiveNames,
              };
        });
      };
  
      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
        set({ sseConnection: null });
      };
  
      set({ sseConnection: eventSource });
      console.log('SSE connection established.');
    },
  
    // This action was already correct
    closeSse: () => {
      get().sseConnection?.close();
      set({ sseConnection: null });
      console.log('SSE connection closed.');
    },
  
    // This action was already correct
    updateAndCleanLiveStatus: () => {
        const now = Date.now();
        const STALE_THRESHOLD_MS = 120000; // 2 minutes
        const currentLocations = get().locations;
    
        const activeLocations: Record<string, LocationData> = {};
        const activeLineNames = new Set<string>();
    
        // Iterate through all known locations
        for (const routeId in currentLocations) {
          const location = currentLocations[routeId];
          // Check if the location update is recent
          if (now - new Date(location.timestamp).getTime() < STALE_THRESHOLD_MS) {
            // If it's recent, it's active
            activeLocations[routeId] = location;
            activeLineNames.add(location.route_name);
          }
        }
    
        // Update the store with both the cleaned locations and the set of live names
        set({ 
          locations: activeLocations,
          liveLineNames: activeLineNames,
        });
      },

  }));
