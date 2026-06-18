import axios from "axios";
import { clearAuth, getToken, setAuthToken } from "../utils/authStorage";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "https://marketnest-backend-htxq.onrender.com/api"),
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/refresh");

    if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await API.post("/auth/refresh");
        const token = refreshResponse.data?.accessToken;

        if (token) {
          setAuthToken(token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }
      } catch {
        clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
