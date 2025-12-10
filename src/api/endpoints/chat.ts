import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";


export interface MensajeDTO {
  id: string;
  contenido: string;
  esPropio: boolean;
  fechaEnvio: string;
  leido: boolean;
}

export interface ConversacionDTO {
  idPublicacion: string;
  tituloPublicacion: string;
  idOtraPersona: string;
  nombreOtraPersona: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  noLeidos: number;
  ultimoMensajePropio: boolean;
}

export interface InfoConversacionDTO {
  idPublicacion: string;
  tituloPublicacion: string;
  idOtraPersona: string;
  nombreOtraPersona: string;
}

interface EnviarMensajeRequest {
  idDestinatario: string;
  idPublicacion: string;
  contenido: string;
}

interface EnviarMensajeResponse {
  idMensaje: string;
  emailEnviado?: boolean;
}

interface ObtenerMensajesResponse {
  mensajes: MensajeDTO[];
  usuarioActualId: string;
}

interface ObtenerConversacionesResponse {
  conversaciones: ConversacionDTO[];
}

interface ObtenerConversacionResponse {
  mensajes: MensajeDTO[];
  infoConversacion: InfoConversacionDTO | null;
  usuarioActualId: string;
}

interface ContarNoLeidosResponse {
  count: number;
}
/// Esto aun no lo estamos usando.. 
const apiChat = {

  enviarMensaje: async (data: EnviarMensajeRequest): Promise<EnviarMensajeResponse> => {
    try {
      const result = await axiosApi.post<EnviarMensajeResponse>(
        '/api/chat/enviar',
        data
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudo enviar el mensaje");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al enviar mensaje"
        );
      }
      throw new Error("Error de conexión");
    }
  },
};

export default apiChat;