import { TokenService } from "../../services/auth/tokenService";
import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";
import axiosApi from "./axios.config";
import isPublicRoute from "./constants";

let globalToastError: ((message: string) => void) | null = null;

export const setGlobalToastError = (fn: (message: string) => void) => {
  globalToastError = fn;
};

/* ------------------------------
   INTERCEPTOR DE REQUEST
-------------------------------- */
axiosApi.interceptors.request.use(
  (config) => {
    const FToken = LocalStorageService.get(STORAGE_KEYS.FTOKEN);

    if (FToken && config.url && !isPublicRoute(config.url)) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${FToken}`, 
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------
   INTERCEPTOR DE RESPONSE
-------------------------------- */
axiosApi.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.error || error.response?.data?.message || "";

    if (status === 401 || status === 403) {
      const mensaje = msg.toLowerCase();

      const tokenProblema =
        mensaje.includes("token") ||
        mensaje.includes("expirado") ||
        mensaje.includes("inválido") ||
        mensaje.includes("autorizado") ||
        mensaje.includes("sesion");

      if (tokenProblema) {
        console.warn("🔒 ID Token expirado o inválido. Cerrando sesión...");

        if (globalToastError) {
          globalToastError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        }

        TokenService.clearAuthData();

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);

        return Promise.reject(new Error("Sesión expirada"));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosApi;
