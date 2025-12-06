import axiosApi from "../config/axios.config";
interface Denuncia {
  mail: string;
  mensaje: string;
}

interface RespuestaContacto {
    mensaje?: string; 
}

const rutaEndpoint = import.meta.env.VITE_URL_REPORTES;
const apiDenuncia = {
    denuncia:{
        enviarDenuncia: async (data: Denuncia): Promise<RespuestaDenuncia> => {

      if (!rutaEndpoint) {
          throw new Error("Error de Configuración: VITE_URL_REPORTES no está definido. Revisa tu archivo .env y asegúrate de reiniciar el servidor de desarrollo.");
      }

      try {
        const resultado = await axiosApi.post<RespuestaContacto>(
          rutaEndpoint, 
          data
        );
        if (resultado.status === 200 || resultado.status === 201) {
          return resultado.data || { mensaje: "Mensaje enviado correctamente." }; 
        }
        
        if (typeof handleApiError === 'function') {
            return handleApiError(resultado.status, "Respuesta inesperada del servidor.");
        }
        throw new Error("Respuesta inesperada del servidor.");

      } catch (error: any) {
        if (error.response) {
          const statusCode = error.response.status;
                    if (statusCode === 404) {
             throw new Error(`Error 404: La ruta de contacto ('${rutaEndpoint}') no fue encontrada. Verifica que la ruta esté bien configurada en tu backend de Render.`);
          }
          
          const mensajeBackend = error.response.data?.message || `Error ${statusCode} del servidor al enviar el mensaje.`;
          throw new Error(mensajeBackend);
        }
        throw new Error("Error de conexión. El servidor de Render podría no estar disponible.");
      }
    },
    }
}

export default apiDenuncia;