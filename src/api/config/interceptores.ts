import { TokenService } from "../../services/auth/tokenService";
import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";
import axiosApi from "./axios.config";
import isPublicRoute from "./constants";

// Variable global para el toast (se setea desde App.tsx)
let globalToastError: ((message: string) => void) | null = null;

export const setGlobalToastError = (fn: (message: string) => void) => {
  globalToastError = fn;
};

// Interceptor de REQUEST
axiosApi.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.get(STORAGE_KEYS.TOKEN);

    if (token && config.url && !isPublicRoute(config.url)) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si es un error 401 (No autorizado) o 403 (Token inválido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const errorMessage = error.response.data?.error || error.response.data?.message || "";
      
      // Si el mensaje indica que el token expiró o es inválido
      if (
        errorMessage.toLowerCase().includes("token") ||
        errorMessage.toLowerCase().includes("expirado") ||
        errorMessage.toLowerCase().includes("inválido") ||
        errorMessage.toLowerCase().includes("autorizado") ||
        errorMessage.toLowerCase().includes("sesion")
      ) {
        console.warn("🔒 Token expirado o inválido. Cerrando sesión...");
        
        // Mostrar toast de error
        if (globalToastError) {
          globalToastError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
        }
        
        // Limpiar localStorage
        TokenService.clearAuthData();
        
        // Esperar 2 segundos para que se vea el toast, luego redirigir
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
        
        return Promise.reject(new Error("Sesión expirada"));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosApi;