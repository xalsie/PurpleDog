import axios, { AxiosInstance, AxiosError } from "axios";
import { storage } from "./storage";
import { store } from "@/store";
import { clearAuth } from "@/store/slices/authSlice";
import { clearUser, setUserRole } from "@/store/slices/userSlice";


const fallbackBaseUrl = "http://localhost:3001";

const normalizeBaseUrl = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);
    const isLocal = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
    if (!isLocal && parsed.protocol === "http:" && process.env.NODE_ENV === "production") {
      parsed.protocol = "https:";
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return rawUrl;
  }
};

const baseApiUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || fallbackBaseUrl);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${baseApiUrl}/api`,
  timeout: 60000, // 60 secondes pour permettre l'analyse IA
  headers: {
    "Content-Type": "application/json",
  },
});

// inject token to requete
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      storage.clearAll();
      store.dispatch(clearAuth());
      store.dispatch(clearUser());
      store.dispatch(setUserRole(null));
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
