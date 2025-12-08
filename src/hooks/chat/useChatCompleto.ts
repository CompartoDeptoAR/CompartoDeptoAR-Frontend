import { useState, useEffect, useCallback } from "react";
import chatService from "../../services/chat/chatService";
import { Conversacion, MensajeUI } from "../../services/chat/types";


export const useChatCompleto = (idUsuarioActual: string) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [cargando, setCargando] = useState(false);
  const [loading, setLoading] = useState(false);
  // 🔍 LOG
  console.log("🎯 useChatCompleto - idUsuarioActual:", idUsuarioActual);

  // Escuchar lista de conversaciones en tiempo real
  useEffect(() => {
    if (!idUsuarioActual) return;

    setLoading(true);
    let firstLoad = true;

    const unsubscribe = chatService.escucharConversaciones(
      idUsuarioActual,
      (nuevasConversaciones) => {
        setConversaciones(nuevasConversaciones);

        if (firstLoad) {
          setLoading(false); 
          firstLoad = false;
        }
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

    console.log("💬 Cargando mensajes de:", conversacionActiva);
    setCargando(true);

    const unsubscribe = chatService.escucharMensajes(
      conversacionActiva,
      idUsuarioActual,
      (nuevosMensajes) => {
        console.log("📨 Mensajes recibidos:", nuevosMensajes);
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
    console.log("✅ Conversación seleccionada:", idPublicacion);
    setConversacionActiva(idPublicacion);
  }, []);

  const cerrarConversacion = useCallback(() => {
    console.log("❌ Cerrando conversación");
    setConversacionActiva(null);
    setMensajes([]);
  }, []);

  const enviarMensaje = useCallback(
    async (contenido: string) => {
      if (!conversacionActiva || !contenido.trim()) return;

      const conversacion = conversaciones.find(
        (c) => c.idPublicacion === conversacionActiva
      );
      if (!conversacion) {
        console.error("❌ No se encontró la conversación");
        return;
      }

      console.log("📤 Enviando mensaje...");
      try {
        await chatService.enviarMensaje(
          contenido,
          idUsuarioActual,
          conversacion.idOtraPersona,
          conversacionActiva
        );
        console.log("✅ Mensaje enviado");
      } catch (err) {
        console.error("❌ Error al enviar:", err);
        throw err;
      }
    },
    [conversacionActiva, conversaciones, idUsuarioActual]
  );

  const conversacionSeleccionada = conversaciones.find(
    (c) => c.idPublicacion === conversacionActiva
  );

  // 🔍 LOG del estado actual
  console.log("📊 Estado actual:", {
    totalConversaciones: conversaciones.length,
    conversacionActiva,
    totalMensajes: mensajes.length,
    cargando,
  });

  return {
    conversaciones,
    conversacionActiva,
    conversacionSeleccionada,
    mensajes,
    cargando,
    loading,
    seleccionarConversacion,
    cerrarConversacion,
    enviarMensaje,
  };
};