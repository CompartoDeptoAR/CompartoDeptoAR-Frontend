import { handleApiError } from "../../helpers/handleApiError";
import { TokenService } from "../../services/auth/tokenService";
import axiosApi from "../config/axios.config";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth.types";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const apiAuth = {
  auth: {
    registrar: async (data: RegisterRequest): Promise<RegisterResponse> => {
      try {
        const payload: RegisterRequest = {
          nombreCompleto: data.nombreCompleto,
          correo: data.correo,
          contraseña: data.contraseña,
          edad: data.edad,
        };

        if (data.genero) payload.genero = data.genero;
        if (data.descripcion) payload.descripcion = data.descripcion;
        if (data.habitos && Object.keys(data.habitos).length > 0) payload.habitos = data.habitos;
        if (data.preferencias && Object.keys(data.preferencias).length > 0) payload.preferencias = data.preferencias;

        const result = await axiosApi.post<RegisterResponse>(
          import.meta.env.VITE_URL_USER,
          payload
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
          `${import.meta.env.VITE_URL_AUTH}/login`,
          data
        );

        console.log(result.data);

        if (result.status === 200) {
          TokenService.saveAuthData(
            {
              ID: result.data.ID,
              rol: result.data.rol,
              mail: result.data.mail,
              uid: result.data.uid,
            },
            data.idToken
          );

          return result.data;
        }

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

    loginConGoogle: async (): Promise<LoginResponse> => {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const resultado = await signInWithPopup(auth, provider);
        const usuario = resultado.user;
        const idToken = await usuario.getIdToken();
        const result = await axiosApi.post<LoginResponse>(
          `${import.meta.env.VITE_URL_AUTH}/login-google`,
          { idToken }
        );

        if (result.status === 200) {
          TokenService.saveAuthData(
            {
              ID: result.data.ID,
              rol: result.data.rol,
              mail: result.data.mail,
              uid: result.data.uid,
            },
            idToken
          );

          return result.data;
        }

        throw new Error("Error al iniciar sesión con Google");
      } catch (error: any) {
        console.error("Error Google Login:", error);
        throw new Error("Error al iniciar sesión con Google");
      }
    },

    logout: (mostrarMensaje = false) => {
      TokenService.clearAuthData();
      if (mostrarMensaje) {
        window.alert(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
      }
    },
  },
};

export default apiAuth;
