import {create} from 'zustand';
import axiosService from './axios.ts';
import{
    type LocationData, type Location,
    type ReplayActions, type ReplayState, type Lines, baseURL
} from './interfaces.ts'
import L from 'leaflet';


export const useReplayStore = create<ReplayState & ReplayActions>((set, get) => ({
    // --- Initial State ---
    selectedRoute: null,
    selectedDate: null,
    trackData: [],
    isLoading: false,
    sliderIndex: 0,
    historylines:[],

    // --- Actions ---
    fetchHistoryLines: async () => {
        try {
          const response = await axiosService.get<Lines[]>(`${baseURL}/route/`);
          set({ historylines: response.data });
        } catch (error) {
          console.error("Failed to fetch available routes:", error);
        }
      },
    // THIS IS THE FUNCTION YOU ASKED FOR
    setSelectedDate: (date: Date | null) => {
      set({ selectedDate: date, trackData: [], sliderIndex: 0 }); // Reset track data when date changes
    },
    
    setSelectedRoute: (route_name: string | null) => {
      set({ selectedRoute: route_name, trackData: [], sliderIndex: 0 }); // Reset track data when route changes
    },
  
    setSliderIndex: (index: number) => {
      set({ sliderIndex: index });
    },
  
    // This action fetches the historical data based on current state
    fetchTrackForDisplay: async () => {
      const { selectedRoute, selectedDate } = get();
  
      if (!selectedRoute || !selectedDate) {
        console.log("Route or Date not selected. Cannot fetch track.");
        return;
      }
  
      set({ isLoading: true, trackData: [] });
  
      try {
        // Format the date to YYYY-MM-DD for the API query
        const dateString = selectedDate.toISOString().split('T')[0];
        const params = {
            route_name: selectedRoute,
            date: dateString,
        };
        const response = await axiosService.get<LocationData[]>(
          `${baseURL}/locationpoints/`, { params: params }
        );
  
        const simplifiedTrackForSlider: Location[] = response.data.map(rawPoint => {
          return {
            latlng: L.latLng(rawPoint.location.latitude, rawPoint.location.longitude),
            ...(rawPoint.timestamp && { timestamp: rawPoint.timestamp })
          };
        });
    
        console.log("API SUCCESS: Received data", response.data);
        console.log("SUCCESS: Processed clean data for slider:", simplifiedTrackForSlider);
          set({
            trackData: simplifiedTrackForSlider, // Use the correct property name
            isLoading: false,
            sliderIndex: 0 // Reset slider to the beginning of the new track
          });
      } catch (error) {
        console.error("Failed to fetch historical track:", error);
        set({ isLoading: false });
      }
    },
  }));