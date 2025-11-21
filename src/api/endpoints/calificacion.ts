import axiosApi from "../config/axios.config";


const apiCalificacion = {
  calificacion: {
    crear: async (data: {
      idCalificado: string;
      puntuacion: number;
      comentario: string;
    }) => {
      try {
        const res = await axiosApi.post(
          import.meta.env.VITE_URL_CALIFICACION,
          data
        );
        return res.data;
      } catch (error: any) {
        if (error.response) {
          throw new Error(error.response.data.error || "Error al calificar");
        }
        throw new Error("Error de conexión");
      }
    },

    obtenerPromedio: async (idUsuario: string): Promise<number> => {
        try {
            const res = await axiosApi.get<{ promedio: number }>(
            `${import.meta.env.VITE_URL_CALIFICACION}/usuario/${idUsuario}`
            );

            return res.data.promedio ?? 0;
        } catch (error: any) {
            if (error.response) {
            throw new Error(error.response.data.error || "Error al obtener promedio");
            }
            return 0;
        }
    },

  },
};

export default apiCalificacion;
