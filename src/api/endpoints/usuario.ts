import type { HabitosUsuario, PreferenciasUsuario, UsuarioPerfil } from "../../modelos/Usuario";
import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";
import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";

interface PerfilHabitosPreferenciasResponse {
  habitos: HabitosUsuario;
  preferencias: PreferenciasUsuario;
}

const apiUsuario = {
  usuario: {
    perfil: async (): Promise<UsuarioPerfil> => {
      const result = await axiosApi.get<UsuarioPerfil>(
        import.meta.env.VITE_URL_USER_PERFIL
      );
      console.log(result.data);
      
      if (result.status === 200) { 
        return result.data;
      }
      return undefined as unknown as UsuarioPerfil;
    },

   editarPerfil: async (data: Partial<UsuarioPerfil>): Promise<UsuarioPerfil> => {
    try {
        const datosLimpios: Record<string, any> = {};
        Object.keys(data).forEach((key) => {
          const valor = data[key as keyof UsuarioPerfil];
          
          if (valor !== undefined && valor !== null) {
            datosLimpios[key] = valor;
          }
        });
        console.log("📤 Datos enviados al backend:", datosLimpios);

        const result = await axiosApi.patch<UsuarioPerfil>(
          import.meta.env.VITE_URL_USER_PERFIL,
          datosLimpios
        );
        return result.data;
      } catch (error: any) {
        if (error.response) {
          console.error("❌ Error del servidor:", error.response.data);
          throw new Error(
            error.response.data.error || error.response.data.message || "Error al editar perfil"
          );
        }
        throw new Error("Error de conexión");
      }
    },

    obtenerPerfilPorId: async (id: string): Promise<UsuarioPerfil> => {
      try {
        const result = await axiosApi.get<UsuarioPerfil>(
          `${import.meta.env.VITE_URL_USER}/${id}`
        );
        return result.data;
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Error al obtener el perfil del usuario"
          );
        }
        throw new Error("Error de conexión");
      }
    },

    obtener: async (): Promise<PerfilHabitosPreferenciasResponse> => {
      try {
        const result = await axiosApi.get<PerfilHabitosPreferenciasResponse>(
          import.meta.env.VITE_URL_PERFIL_HABITOS_PREFERECIAS
        );
        console.log(result.data);
        console.log(result.status);
        
        if (result.status === 200) return result.data;

        return handleApiError(
          result.status,
          "No se pudieron obtener los hábitos y preferencias"
        );
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Error al obtener hábitos y preferencias"
          );
        }
        throw new Error("Error de conexión");
      }
    },

    eliminarMiCuenta: async (): Promise<{ mensaje: string; success: boolean }> => {
      try {
    
        const token = LocalStorageService.get(STORAGE_KEYS.FTOKEN);
        console.log("🔍 Token en localStorage:", token ? "✅ Existe" : "❌ No existe");
        console.log("🔍 Key buscada:", STORAGE_KEYS.FTOKEN);
        console.log("🔍 Todas las keys en localStorage:", Object.keys(localStorage));
        
        const result = await axiosApi.delete<{ mensaje: string; success: boolean }>(
          `${import.meta.env.VITE_URL_USER}/cuenta/eliminar`
        );
        return result.data;
      } catch (error: any) {
        console.error("❌ Error completo:", error);
        console.error("❌ Response:", error.response);
        console.error("❌ Status:", error.response?.status);
        console.error("❌ Data:", error.response?.data);
        
        if (error.response) {
          throw new Error(
            error.response.data.error || "Error al eliminar cuenta"
          );
        }
        throw new Error("Error de conexión");
      }
    },

  }
}


export default apiUsuario;