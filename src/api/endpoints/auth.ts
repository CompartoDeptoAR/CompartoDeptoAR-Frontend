import { handleApiError } from "../../helpers/handleApiError";
import axiosApi from "../config/axios.config";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.types";


const apiAuth = {
  auth: {
    registrar: async (data: RegisterRequest): Promise<RegisterResponse> => {
      try {
        const datos: RegisterRequest = {
          nombreCompleto: data.nombreCompleto,
          correo: data.correo,
          contraseña: data.contraseña,
          edad: data.edad,
        };

        if (data.genero) datos.genero = data.genero;
        if (data.descripcion) datos.descripcion = data.descripcion;
        if (data.habitos) datos.habitos = data.habitos;
        if (data.preferencias) datos.preferencias = data.preferencias;

        const result = await axiosApi.post<RegisterResponse>(
          import.meta.env.VITE_URL_USER,
          datos
        );

        if (result.status === 201) return result.data;

        return handleApiError(
          result.status,
          "No se pudo registrar el usuario",
        );
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Error al registrarse"
          );
        }
        throw new Error("Error de conexión");
      }
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
      try {
        const result = await axiosApi.post<LoginResponse>(
          import.meta.env.VITE_URL_AUTH + "/login",
          data
        );

        if (result.status === 200) return result.data;

        throw new Error("Error al iniciar sesión");
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Credenciales inválidas"
          );
        }
        throw new Error("Error de conexión");
      }
    },
  },
};

export default apiAuth;