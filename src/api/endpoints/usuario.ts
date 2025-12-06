import { data } from "react-router-dom";
import type { HabitosUsuario, PreferenciasUsuario, UsuarioPerfil } from "../../modelos/Usuario";
import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";

interface PerfilHabitosPreferenciasResponse {
  habitos: HabitosUsuario;
  preferencias: PreferenciasUsuario;
}


const apiUsuario = {
    usuario: {
      
        perfil: async():Promise<UsuarioPerfil>=>{
            const result= await axiosApi.get<UsuarioPerfil>(
                import.meta.env.VITE_URL_USER_PERFIL
            )
            console.log(data)
            
            if (result.status === 200) { 
                return result.data;
            }
            return undefined as unknown as UsuarioPerfil;
           
        },
        editarPerfil: async ( data: Partial<UsuarioPerfil>): Promise<UsuarioPerfil> => {
            try {
                const result = await axiosApi.put<UsuarioPerfil>(
                import.meta.env.VITE_URL_USER_PERFIL,
                data
                );
                return result.data;
            } catch (error: any) {
                if (error.response) {
                throw new Error(
                    error.response.data.message || "Error al editar perfil"
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
                        error.response.data.message ||
                        "Error al obtener el perfil del usuario"
                    );
                }
                throw new Error("Error de conexión");
            }
        },
        obtener: async ():Promise<PerfilHabitosPreferenciasResponse> => {
        try {
            const result = await axiosApi.get<PerfilHabitosPreferenciasResponse>(
                import.meta.env.VITE_URL_PERFIL_HABITOS_PREFERECIAS
            );
            console.log(result.data)
            console.log(result.status)
            if (result.status === 200) return result.data;

                return handleApiError(
                result.status,
                "No se pudieron obtener los hábitos y preferencias"
                );
            } catch (error: any) {
                if (error.response) {
                throw new Error(
                    error.response.data.message ||
                    "Error al obtener hábitos y preferencias"
                );
                }
                throw new Error("Error de conexión");
            }
        },
       
    }
}

export default apiUsuario;