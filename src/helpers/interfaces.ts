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