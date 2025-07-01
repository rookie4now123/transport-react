import { useNavigate, type NavigateFunction } from "react-router";
import axiosService from "../helpers/axios";
import axios, {type AxiosResponse, AxiosError} from "axios";
import {
   type User, 
   type AuthData, 
   type LoginInput,  
   type LogoutInput, baseURL} from "../helpers/interfaces"


function useUserActions() {
  const navigate: NavigateFunction = useNavigate();
  return {
    login,
    logout,
    edit,
  };

  // Login the user
  async function login(data: LoginInput):Promise<AxiosResponse<AuthData>> {
    try{
    const res = await axios.post<AuthData>(`${baseURL}/auth/login/`, data);
    setUserData(res.data);
    navigate("/dashboard");
    return res;
    }
    catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw if the caller needs to handle it too
    }
  }

  // Edit the user
  async function edit(data: FormData, userId: number | string): Promise<AxiosResponse<User>> {
    // try {
      const res = await axiosService // Assuming axiosService is configured for auth headers
         .patch<User>(`${baseURL}/user/${userId}/`, data, {
            headers: {
              "content-type": "multipart/form-data",
            },
          });

      // Update the user property in the existing local storage auth data
      const currentAuth: AuthData | null = JSON.parse(localStorage.getItem("auth") || "null");
      if (currentAuth) {
           localStorage.setItem(
              "auth",
               JSON.stringify({
                 ...currentAuth,
                 user: res.data, // Update the user object
               })
           );
      } else {
           console.error("Attempted to edit user data without existing auth token in localStorage");
      }
      return res;
  }

  // Logout the user
  async function logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await axiosService.post<any, AxiosResponse<any>, LogoutInput>(
          `/auth/logout/`, // Path relative to baseURL
          { refresh: refreshToken }
        );
      }
    } catch (error) {
      console.error("Backend logout failed, but proceeding with client-side logout.", error);
    } finally {
      localStorage.removeItem("auth");
      navigate("/");
    }
  }
}

function useCrud() {
  async function get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axiosService.get<T>(`${baseURL}/${url}`, { params });
      return response.data;
    } catch (error) {
      console.error(`GET request to ${url} failed:`, error);
      throw error;
    }
  }
  async function post<T, U>(url: string, data: U): Promise<T> {
    try {
      const response = await axiosService.post<T>(`${baseURL}/${url}`, data);
      return response.data;
    } catch (error) {
      console.error(`POST request to ${url} failed:`, error);
      throw error;
    }
  }

  // You can also add put, patch, delete in the same pattern
  // async function put<T, U>...
  // async function del<T>...

  // Expose the functions so components can use them
  return {
    get,
    post,
    // put,
    // del
  };
}

// Get the user
function getUser(): User | null {
    const authString = localStorage.getItem("auth") || "null";
    const auth: AuthData | null = JSON.parse(authString); // Now JSON.parse gets a string
    return auth?.user || null;
}

// Get the access token
function getAccessToken(): string | null {
    const authString = localStorage.getItem("auth") || "null";
    const auth: AuthData | null = JSON.parse(authString); // Now JSON.parse gets a string
    return auth?.access || null; // Use optional chaining and nullish coalescing
  }

// Get the refresh token
function getRefreshToken(): string | null {
    const authString = localStorage.getItem("auth") || "null";
    const auth: AuthData | null = JSON.parse(authString);
    return auth?.refresh || null;
  }

// Set the access, token and user property
function setUserData(data: AuthData): void {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      })
    );
  }

export {
  useCrud,
  useUserActions,
  getUser,
  getAccessToken,
  getRefreshToken,
  setUserData,
};