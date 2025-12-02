import { useState, useEffect } from "react";
import apiChat, { ConversacionDTO, MensajeDTO, InfoConversacionDTO } from "../../api/endpoints/chat";

export const useConversaciones = () => {
  const [conversaciones, setConversaciones] = useState<ConversacionDTO[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<MensajeDTO[]>([]);
  const [infoConversacion, setInfoConversacion] = useState<InfoConversacionDTO | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Cargar lista de conversaciones con polling
  useEffect(() => {
    cargarConversaciones();
    const interval = setInterval(cargarConversaciones, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cargar mensajes cuando cambia la conversación activa
  useEffect(() => {
    if (conversacionActiva) {
      cargarMensajesConversacion(conversacionActiva);
      const interval = setInterval(() => cargarMensajesConversacion(conversacionActiva), 3000);
      return () => clearInterval(interval);
    }
  }, [conversacionActiva]);

  const cargarConversaciones = async () => {
    try {
      const data = await apiChat.obtenerConversaciones();
      setConversaciones(data.conversaciones);
    } catch (err: any) {
      console.error("Error al cargar conversaciones:", err);
      setError(err.message);
    }
  };

  const cargarMensajesConversacion = async (idPub: string) => {
    setCargando(true);
    try {
      const data = await apiChat.obtenerConversacion(idPub);
      setMensajes(data.mensajes);
      setInfoConversacion(data.infoConversacion);

      // Marcar como leídos
      const noLeidos = data.mensajes
        .filter(m => !m.leido && !m.esPropio)
        .map(m => m.id);
      
      if (noLeidos.length > 0) {
        await apiChat.marcarLeidos(noLeidos);
        await cargarConversaciones(); // Actualizar badge
      }
    } catch (err: any) {
      console.error("Error al cargar mensajes:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarConversacion = (idPublicacion: string) => {
    setConversacionActiva(idPublicacion);
    setError("");
  };

  const cerrarConversacion = () => {
    setConversacionActiva(null);
    setMensajes([]);
    setInfoConversacion(null);
  };

  return {
    conversaciones,
    conversacionActiva,
    mensajes,
    infoConversacion,
    cargando,
    error,
    seleccionarConversacion,
    cerrarConversacion,
    recargarConversaciones: cargarConversaciones,
  };
};