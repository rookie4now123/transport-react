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
        set(state => ({
          locations: {
            ...state.locations,
            [newLocation.route_id]: newLocation,
          }
        }));
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
    clearStaleLocations: () => {
      const now = Date.now();
      const STALE_THRESHOLD_MS = 120000;
  
      set(state => {
        const stillActive: Record<string, LocationData> = {};
        Object.values(state.locations).forEach(loc => {
          if (now - new Date(loc.timestamp).getTime() < STALE_THRESHOLD_MS) {
            stillActive[loc.route_id] = loc;
          }
        });
        return { locations: stillActive };
      });
    },


  }));
