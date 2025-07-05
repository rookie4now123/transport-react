import { type LatLng } from 'leaflet';

export interface User {
    id: string;
    username: string;
    email: string | null;
    first_name: string;
    last_name: string;
    user_type: string;
  }

export interface AuthData {
    access: string;
    refresh: string;
    user: User;
  }

export interface LoginInput {
    username: string;
    password: string;
  }

export interface LogoutInput {
    refresh: string;
  }

export interface AuthState {
    isAuthenticated: boolean;
    logout: () => void;
    // You can add a login action here too
  }
export interface ProtectedRouteProps {
    children: React.ReactNode;
  }

export interface Location {
    latlng: LatLng;
    timestamp?: string;
  }
  
export interface Station {
    id: string;               // JSON id is a string (UUID)
    station_name: string;     // matches "station_name" in JSON
    location: Location;       // nested object with latitude and longitude
  }

export interface Lines{
  id: string;
  route_name: string;
}

export interface LocationData {
  route_id: string;
  route_name: string;
  monitor_name: string;
  run_id: string; // The UUID of the RouteRun
  location: { // <-- The 'location' property is now an object
    latitude: number;
    longitude: number;
  };
  timestamp: string; // The ISO 8601 timestamp string
}

export interface TrackingState {
  lines: Lines[];
  selectedLines: string[];
  locations: Record<string, LocationData>; // Live locations indexed by route_id
  sseConnection: EventSource | null;
  flyToLocation: LatLngTuple | null;
  liveLineNames: Set<string>;
}

export interface TrackingActions {
  fetchLines: () => Promise<void>;
  toggleLineSelection: (lineName: string) => void;
  initSse: () => void;
  closeSse: () => void;

  updateAndCleanLiveStatus: () => void;
  clearFlyToLocation: () => void; // <-- ADD THIS
}

export interface ReplayState {
  selectedRoute: string | null;
  selectedDate: Date | null;
  trackData: Location[]; // The full track for the day
  isLoading: boolean;
  sliderIndex: number;
  historylines: Lines[];
}

export interface ReplayActions {
  setSelectedDate: (date: Date | null) => void;
  setSelectedRoute: (route_name: string | null) => void;
  fetchTrackForDisplay: () => Promise<void>;
  setSliderIndex: (index: number) => void;
  fetchHistoryLines: () => Promise<void>;
}



export const baseURL = "http://localhost:8000/api";
export type LatLngTuple = [number, number];