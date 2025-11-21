import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";

interface SolicitudContacto {
  mail: string;
  mensaje: string;
}

interface RespuestaContacto {
    mensaje: string; // Mensaje que puede devolver el back...
}


const apiContacto = {
  contacto: {
    enviarMensaje: async (data: SolicitudContacto): Promise<RespuestaContacto> => {
      try {
        const rutaEndpoint = import.meta.env.VITE_URL_CONTACTO;
        
        const resultado = await axiosApi.post<RespuestaContacto>(
          rutaEndpoint, 
          data
        );

        if (resultado.status === 200 || resultado.status === 201) {

          return resultado.data || { mensaje: "Mensaje enviado correctamente." }; 
        }

        return handleApiError(
          resultado.status,
          "El backend devolvió un estado inesperado al enviar el mensaje.",
        );

      } catch (error: any) {
        if (error.response) {
          const mensajeBackend = error.response.data?.message || "Error del servidor al enviar el mensaje.";
          throw new Error(mensajeBackend);
        }
        throw new Error("Error de conexión. Asegúrate de que el backend esté accesible (Render o local).");
      }
    },
  },
};

export default apiContacto;