import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";
import { HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";

interface PerfilHabitosPreferenciasResponse {
  habitos: HabitosUsuario;
  preferencias: PreferenciasUsuario;
}

const apiHabitosPreferencias = {
  perfil: {
    obtener: async ():Promise<PerfilHabitosPreferenciasResponse> => {
      try {
        const result = await axiosApi.get<PerfilHabitosPreferenciasResponse>(
            import.meta.env.VITE_URL_PERFIL_HABITOS_PREFERECIAS
        );
        
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
  },
};

export default apiHabitosPreferencias;
