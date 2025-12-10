import { handleApiError } from "../../helpers/handleApiError";
import { Calificacion } from "../../modelos/Calificacion";
import axiosApi from "../config/axios.config";

export interface CalificacionCrear {
  idCalificado: string;
  puntuacion: number;
  comentario: string;
  nombreCalificador: string;
}

export interface CrearCalificacionResponse {
  mensaje: string;
  promedio: number;
}

export interface CalificacionResponse {
  promedio: number;
  calificaciones: Calificacion[];
}

export interface PromedioResponse {
  promedio: number;
  cantidad: number;
}

const apiCalificacion = {
  calificacion: {
    crear: async ( data: CalificacionCrear ): Promise<CrearCalificacionResponse> => {
      try {
        const res = await axiosApi.post<CrearCalificacionResponse>(
          import.meta.env.VITE_URL_CALIFICACION,
          data
        );
        if (res.status === 201) {
          return res.data;
        }
        
        handleApiError(
          res.status,
          "No se pudo registrar el guargar la calificacion",
        );

      } catch (error: any) {
        if (error.response) {
          throw new Error(error.response.data.error || "Error al calificar");
        }
        throw new Error("Error de conexión");
      }
    },

  
    obtenerPorUsuario: async (idUsuario: string): Promise<CalificacionResponse> => {
      try {
        const res = await axiosApi.get<CalificacionResponse>(
          `${import.meta.env.VITE_URL_CALIFICACION}/${idUsuario}`
        );
        if (res.status === 200) return res.data;

        handleApiError(res.status, "No se pudo obtener la calificacion");
      } catch (error: any) {
        if (error.response) throw new Error(error.response.data.error || "Error al obtener calificaciones");
        throw new Error("Error de conexión");
      }
    },

    obtenerPromedio: async (idUsuario: string): Promise<PromedioResponse> => {
      try {
        const res = await axiosApi.get<PromedioResponse>(
          `${import.meta.env.VITE_URL_CALIFICACION}/${idUsuario}/promedio` // <--- endpoint distinto
        );

        if (res.status === 200) return res.data;

        handleApiError(res.status, "No se pudo obtener el promedio");
      } catch (error: any) {
        if (error.response) throw new Error(error.response.data.error || "Error al obtener promedio");
        throw new Error("Error de conexión");
      }
    },
  },
}

export default apiCalificacion;