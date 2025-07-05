import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { type AuthData } from "./interfaces";
import {
  getAccessToken,
  getRefreshToken,
  setUserData,
} from "../hooks/useractions";
import { useAuthStore } from "./authStore";
import { baseURL } from "./interfaces";
const axiosService: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const refreshAuthLogic = async (failedRequest: any): Promise<void> => {

  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    const tokenRefreshResponse: AxiosResponse<AuthData> = await axios.post(
      `${baseURL}/auth/refresh/`,
      { refresh: refreshToken }
    );
    
  //   const newAuthData = tokenRefreshResponse.data;
  //   setUserData(newAuthData);
  //   failedRequest.response.config.headers[
  //     "Authorization"
  //   ] = `Bearer ${newAuthData.access}`;
  //   axiosService.defaults.headers.common[
  //     "Authorization"
  // ] = `Bearer ${newAuthData.access}`;
   const newAccessToken = tokenRefreshResponse.data.access;

  const oldAuthDataString = localStorage.getItem("auth");
  if (!oldAuthDataString) {
      throw new Error("No auth data found in storage during refresh.");
  }
  const oldAuthData: AuthData = JSON.parse(oldAuthDataString);
  const updatedAuthData: AuthData = {
      ...oldAuthData, // This preserves the 'refresh' and 'user' fields
      access: newAccessToken, // This overwrites with the new access token
  };
  setUserData(updatedAuthData);

  failedRequest.response.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
  //axiosService.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

    return Promise.resolve();
  } catch (error) {
    localStorage.removeItem('auth');
    //useAuthStore.getState().logout();
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export async function fetcher<T>(url: string): Promise<T> {
  const response = await axiosService.get<T>(url);
  return response.data;
}

export default axiosService;
