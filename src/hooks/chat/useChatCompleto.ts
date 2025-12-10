import { useState, useEffect, useCallback, useRef } from "react";
import chatService from "../../services/chat/chatService";
import { Conversacion, MensajeUI } from "../../services/chat/types";

export const useChatCompleto = (idUsuarioActual: string) => {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [cargando, setCargando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const unsubscribeConversacionesRef = useRef<(() => void) | null>(null);
  const unsubscribeMensajesRef = useRef<(() => void) | null>(null);


  useEffect(() => {
    if (!idUsuarioActual) {
      setLoading(false);
      return;
    }

    console.log("🎧 Iniciando escucha de conversaciones para:", idUsuarioActual);
    setLoading(true);
    setError(null);

    let primeraVez = true;

    try {
      const unsubscribe = chatService.escucharConversaciones(
        idUsuarioActual,
        (nuevasConversaciones) => {
          console.log("📋 Conversaciones recibidas:", nuevasConversaciones.length);
          setConversaciones(nuevasConversaciones);

          if (primeraVez) {
            setLoading(false);
            primeraVez = false;
          }
        }
      );

      unsubscribeConversacionesRef.current = unsubscribe;

      return () => {
        console.log("🔌 Desconectando escucha de conversaciones");
        if (unsubscribeConversacionesRef.current) {
          unsubscribeConversacionesRef.current();
          unsubscribeConversacionesRef.current = null;
        }
      };
    } catch (err) {
      console.error("❌ Error al escuchar conversaciones:", err);
      setError("Error al cargar conversaciones");
      setLoading(false);
    }
  }, [idUsuarioActual]);

  useEffect(() => {

    if (unsubscribeMensajesRef.current) {
      console.log("🔌 Limpiando suscripción anterior de mensajes");
      unsubscribeMensajesRef.current();
      unsubscribeMensajesRef.current = null;
    }

    if (!conversacionActiva || !idUsuarioActual) {
      setMensajes([]);
      setCargando(false);
      return;
    }

    console.log("💬 Escuchando mensajes de:", conversacionActiva);
    setCargando(true);
    setError(null);

    try {
      const unsubscribe = chatService.escucharMensajes(
        conversacionActiva,
        idUsuarioActual,
        (nuevosMensajes) => {
          console.log("📨 Mensajes recibidos:", nuevosMensajes.length);
          setMensajes(nuevosMensajes);
          setCargando(false);

          const noLeidos = nuevosMensajes
            .filter((m) => !m.leido && !m.esPropio)
            .map((m) => m.id);

          if (noLeidos.length > 0) {
            console.log("✅ Marcando como leídos:", noLeidos.length);
            chatService.marcarComoLeidos(noLeidos).catch((err) => {
              console.error("Error al marcar como leídos:", err);
            });
          }
        }
      );

      unsubscribeMensajesRef.current = unsubscribe;

      return () => {
        console.log("🔌 Desconectando escucha de mensajes");
        if (unsubscribeMensajesRef.current) {
          unsubscribeMensajesRef.current();
          unsubscribeMensajesRef.current = null;
        }
      };
    } catch (err) {
      console.error("❌ Error al escuchar mensajes:", err);
      setError("Error al cargar mensajes");
      setCargando(false);
    }
  }, [conversacionActiva, idUsuarioActual]);

  const seleccionarConversacion = useCallback((idPublicacion: string) => {
    console.log("✅ Conversación seleccionada:", idPublicacion);
    setConversacionActiva(idPublicacion);
    setError(null);
  }, []);


  const cerrarConversacion = useCallback(() => {
    console.log("❌ Cerrando conversación");
    setConversacionActiva(null);
    setMensajes([]);
    setError(null);
  }, []);

  
  const enviarMensaje = useCallback(
    async (contenido: string) => {
      if (!conversacionActiva || !contenido.trim()) {
        console.warn("⚠️ No se puede enviar mensaje vacío");
        return;
      }

      const conversacion = conversaciones.find(
        (c) => c.idPublicacion === conversacionActiva
      );

      if (!conversacion) {
        console.error("❌ Conversación no encontrada");
        setError("No se encontró la conversación");
        throw new Error("Conversación no encontrada");
      }

      console.log("📤 Enviando mensaje a:", conversacion.idOtraPersona);

      try {
        await chatService.enviarMensaje(
          contenido,
          idUsuarioActual,
          conversacion.idOtraPersona,
          conversacionActiva
        );
        console.log("✅ Mensaje enviado");
      } catch (err) {
        console.error("❌ Error al enviar mensaje:", err);
        setError("Error al enviar mensaje");
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
    loading,
    error,
    seleccionarConversacion,
    cerrarConversacion,
    enviarMensaje,
  };
};