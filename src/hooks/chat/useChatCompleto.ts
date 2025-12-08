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
    setLoading(true);
    setError(null);

    let primeraConsulta = true;

    try {
      const unsubscribe = chatService.escucharConversaciones(
        idUsuarioActual,
        (nuevasConversaciones) => {
          console.log("📋 Conversaciones actualizadas:", nuevasConversaciones.length);
          setConversaciones(nuevasConversaciones);

          if (primeraConsulta) {
            setLoading(false);
            primeraConsulta = false;
          }
        }
      );

      unsubscribeConversacionesRef.current = unsubscribe;

      return () => {
        console.log("🔌 Desconectando escucha de conversaciones");
        unsubscribe();
      };
    } catch (err) {
      console.error("❌ Error al escuchar conversaciones:", err);
      setError("Error al cargar conversaciones");
      setLoading(false);
    }
  }, [idUsuarioActual]);

  // ==================== ESCUCHAR MENSAJES ====================
  useEffect(() => {
    // Limpiar mensajes anteriores
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

    console.log("💬 Cargando mensajes de conversación:", conversacionActiva);
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

          // Marcar como leídos los mensajes que no son propios
          const noLeidos = nuevosMensajes
            .filter((m) => !m.leido && !m.esPropio)
            .map((m) => m.id);

          if (noLeidos.length > 0) {
            console.log("✅ Marcando como leídos:", noLeidos.length, "mensajes");
            chatService.marcarComoLeidos(noLeidos).catch((err) => {
              console.error("Error al marcar como leídos:", err);
            });
          }
        }
      );

      unsubscribeMensajesRef.current = unsubscribe;

      return () => {
        console.log("🔌 Desconectando escucha de mensajes");
        unsubscribe();
      };
    } catch (err) {
      console.error("❌ Error al escuchar mensajes:", err);
      setError("Error al cargar mensajes");
      setCargando(false);
    }
  }, [conversacionActiva, idUsuarioActual]);

  // ==================== SELECCIONAR CONVERSACIÓN ====================
  const seleccionarConversacion = useCallback((idPublicacion: string) => {
    console.log("✅ Conversación seleccionada:", idPublicacion);
    setConversacionActiva(idPublicacion);
    setError(null);
  }, []);

  // ==================== CERRAR CONVERSACIÓN ====================
  const cerrarConversacion = useCallback(() => {
    console.log("❌ Cerrando conversación");
    setConversacionActiva(null);
    setMensajes([]);
    setError(null);
  }, []);

  // ==================== ENVIAR MENSAJE ====================
  const enviarMensaje = useCallback(
    async (contenido: string) => {
      if (!conversacionActiva || !contenido.trim()) {
        console.warn("⚠️ No se puede enviar mensaje vacío o sin conversación");
        return;
      }

      const conversacion = conversaciones.find(
        (c) => c.idPublicacion === conversacionActiva
      );

      if (!conversacion) {
        console.error("❌ No se encontró la conversación activa");
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
        console.log("✅ Mensaje enviado correctamente");
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