import { useState, useEffect, useCallback } from "react";
import chatService from "../../services/chat/chatService";
import { Conversacion, MensajeUI } from "../../services/chat/ types";


export const useChatCompleto = (idUsuarioActual: string) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [cargando, setCargando] = useState(false);

  // Escuchar lista de conversaciones en tiempo real
  useEffect(() => {
    if (!idUsuarioActual) return;

    const unsubscribe = chatService.escucharConversaciones(
      idUsuarioActual,
      (nuevasConversaciones) => {
        setConversaciones(nuevasConversaciones);
      }
    );

    return () => unsubscribe();
  }, [idUsuarioActual]);

  // Escuchar mensajes de la conversación activa
  useEffect(() => {
    if (!conversacionActiva || !idUsuarioActual) {
      setMensajes([]);
      return;
    }

    setCargando(true);

    const unsubscribe = chatService.escucharMensajes(
      conversacionActiva,
      idUsuarioActual,
      (nuevosMensajes) => {
        setMensajes(nuevosMensajes);
        setCargando(false);

        // Marcar como leídos
        const noLeidos = nuevosMensajes
          .filter((m) => !m.leido && !m.esPropio)
          .map((m) => m.id);

        if (noLeidos.length > 0) {
          chatService.marcarComoLeidos(noLeidos);
        }
      }
    );

    return () => unsubscribe();
  }, [conversacionActiva, idUsuarioActual]);

  const seleccionarConversacion = useCallback((idPublicacion: string) => {
    setConversacionActiva(idPublicacion);
  }, []);

  const cerrarConversacion = useCallback(() => {
    setConversacionActiva(null);
    setMensajes([]);
  }, []);

  const enviarMensaje = useCallback(
    async (contenido: string) => {
      if (!conversacionActiva || !contenido.trim()) return;

      const conversacion = conversaciones.find(
        (c) => c.idPublicacion === conversacionActiva
      );
      if (!conversacion) return;

      try {
        await chatService.enviarMensaje(
          contenido,
          idUsuarioActual,
          conversacion.idOtraPersona,
          conversacionActiva
        );
      } catch (err) {
        console.error("Error al enviar:", err);
        throw err;
      }
    },
    [conversacionActiva, conversaciones, idUsuarioActual]
  );

  const conversacionSeleccionada = conversaciones.find(
    (c) => c.idPublicacion === conversacionActiva
  );

  return {
    conversaciones,
    conversacionActiva,
    conversacionSeleccionada,
    mensajes,
    cargando,
    seleccionarConversacion,
    cerrarConversacion,
    enviarMensaje,
  };
};