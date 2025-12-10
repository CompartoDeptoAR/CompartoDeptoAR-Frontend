import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";

// Interfaces
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

// API
const apiChat = {
  // Enviar mensaje normal
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

  // Primer contacto (con email)
  primerContacto: async (data: EnviarMensajeRequest): Promise<EnviarMensajeResponse> => {
    try {
      const result = await axiosApi.post<EnviarMensajeResponse>(
        '/api/chat/primer-contacto',
        data
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudo enviar el primer mensaje");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al enviar primer mensaje"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Obtener mensajes de una publicación
  obtenerMensajes: async (idPublicacion: string): Promise<ObtenerMensajesResponse> => {
    try {
      const result = await axiosApi.get<ObtenerMensajesResponse>(
        `/api/chat/publicacion/${idPublicacion}`
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudieron obtener los mensajes");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al obtener mensajes"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Obtener lista de conversaciones
  obtenerConversaciones: async (): Promise<ObtenerConversacionesResponse> => {
    try {
      const result = await axiosApi.get<ObtenerConversacionesResponse>(
        '/api/chat/conversaciones'
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudieron obtener las conversaciones");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al obtener conversaciones"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Obtener conversación completa
  obtenerConversacion: async (idPublicacion: string): Promise<ObtenerConversacionResponse> => {
    try {
      const result = await axiosApi.get<ObtenerConversacionResponse>(
        `/api/chat/conversacion/${idPublicacion}`
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudo obtener la conversación");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al obtener conversación"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Contar mensajes no leídos
  contarNoLeidos: async (): Promise<ContarNoLeidosResponse> => {
    try {
      const result = await axiosApi.get<ContarNoLeidosResponse>(
        '/api/chat/notificaciones/count'
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudo obtener el contador");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al contar mensajes"
        );
      }
      throw new Error("Error de conexión");
    }
  },

  // Marcar mensajes como leídos
  marcarLeidos: async (idsMensajes: string[]): Promise<{ success: boolean }> => {
    try {
      const result = await axiosApi.post<{ success: boolean }>(
        '/api/chat/marcarleidos',
        { idsMensajes }
      );

      if (result.status === 200) return result.data;

      return handleApiError(result.status, "No se pudieron marcar como leídos");
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.error || "Error al marcar como leídos"
        );
      }
      throw new Error("Error de conexión");
    }
  },
};

export default apiChat;