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
    latitude: number;
    longitude: number;
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
  latitude: number;
  longitude: number;
  timestamp: string; // The ISO 8601 timestamp string
}

export interface TrackingState {
  lines: Lines[];
  selectedLines: string[];
  locations: Record<string, LocationData>; // Live locations indexed by route_id
  sseConnection: EventSource | null;
  flyToLocation: LatLngTuple | null;
}

export interface TrackingActions {
  fetchLines: () => Promise<void>;
  toggleLineSelection: (lineName: string) => void;
  initSse: () => void;
  closeSse: () => void;
  clearStaleLocations: () => void;
  clearFlyToLocation: () => void; // <-- ADD THIS
}

export const baseURL = "http://localhost:8000/api";
export type LatLngTuple = [number, number];