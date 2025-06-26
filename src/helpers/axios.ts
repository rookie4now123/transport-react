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

const BASEURL = "http://127.0.0.1:8000/";
const axiosService: AxiosInstance = axios.create({
  baseURL: BASEURL,
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
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("No refresh token available. User must re-authenticate.");
    return Promise.reject(failedRequest.response.error);
  }
  try {
    const tokenRefreshResponse: AxiosResponse<AuthData> = await axios.post(
      `${BASEURL}/auth/refresh/`,
      { refresh: refreshToken }
    );
    const newAuthData = tokenRefreshResponse.data;
    setUserData(newAuthData);
    failedRequest.response.config.headers[
      "Authorization"
    ] = `Bearer ${newAuthData.access}`;
    return Promise.resolve();
  } catch (error) {
    console.error("Unable to refresh token. Forcing logout.", error);
    useAuthStore.getState().logout();
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export async function fetcher<T>(url: string): Promise<T> {
  const response = await axiosService.get<T>(url);
  return response.data;
}

export default axiosService;
