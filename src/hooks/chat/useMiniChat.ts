import { useState, useEffect, useCallback } from "react";
import { MensajeUI } from "../../services/chat/types";
import chatService from "../../services/chat/chatService";


interface UseMiniChatProps {
  idPublicacion: string;
  idDestinatario: string;
  idUsuarioActual: string;
  visible: boolean;
}

export const useMiniChat = ({
  idPublicacion,
  idDestinatario,
  idUsuarioActual,
  visible,
}: UseMiniChatProps) => {
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  // Escuchar mensajes en tiempo real
  useEffect(() => {
    if (!visible || !idPublicacion || !idUsuarioActual) return;

    const unsubscribe = chatService.escucharMensajes(
      idPublicacion,
      idUsuarioActual,
      (nuevosMensajes) => {
        setMensajes(nuevosMensajes);

        // Marcar como leídos los mensajes recibidos
        const noLeidos = nuevosMensajes
          .filter((m) => !m.leido && !m.esPropio)
          .map((m) => m.id);

        if (noLeidos.length > 0) {
          chatService.marcarComoLeidos(noLeidos);
        }
      }
    );

    return () => unsubscribe();
  }, [visible, idPublicacion, idUsuarioActual]);

  const enviarMensaje = useCallback(async () => {
    if (!mensaje.trim() || enviando) return;

    setEnviando(true);
    setError("");

    try {
      await chatService.enviarMensaje(
        mensaje,
        idUsuarioActual,
        idDestinatario,
        idPublicacion
      );
      setMensaje("");
    } catch (err: any) {
      setError(err.message || "Error al enviar mensaje");
      console.error("Error al enviar:", err);
    } finally {
      setEnviando(false);
    }
  }, [mensaje, idUsuarioActual, idDestinatario, idPublicacion, enviando]);

  return {
    mensajes,
    mensaje,
    setMensaje,
    enviando,
    error,
    enviarMensaje,
  };
};