import {create} from 'zustand';
import { type AuthState } from './interfaces';
const getInitialIsAuthenticated = (): boolean => {
  try {
    const authString = localStorage.getItem('auth');
    return !!authString; // Return true if the string exists, false otherwise
  } catch (e) {
    return false;
  }
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: getInitialIsAuthenticated(),
  logout: () => {
    localStorage.removeItem('auth');
    set({ isAuthenticated: false });
  },
}));