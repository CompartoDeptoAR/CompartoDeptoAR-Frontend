import { useState, useEffect, useRef } from "react";
import apiChat, { MensajeDTO } from "../../api/endpoints/chat";


interface UseMensajesProps {
  idPublicacion: string;
  idDestinatario: string;
  visible: boolean;
}

export const useMensajes = ({ idPublicacion, idDestinatario, visible }: UseMensajesProps) => {
  const [mensajes, setMensajes] = useState<MensajeDTO[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [esPrimerMensaje, setEsPrimerMensaje] = useState(false);
  const intervaloRef = useRef<number | null>(null);

  // Cargar mensajes al abrir y con polling
  useEffect(() => {
    if (visible && idPublicacion) {
      cargarMensajes();
      
      // Polling cada 3 segundos
      intervaloRef.current = window.setInterval(cargarMensajes, 3000);
      
      return () => {
        if (intervaloRef.current) {
          clearInterval(intervaloRef.current);
        }
      };
    }
  }, [visible, idPublicacion]);

  const cargarMensajes = async () => {
    try {
      const data = await apiChat.obtenerMensajes(idPublicacion);
      setMensajes(data.mensajes);
      setEsPrimerMensaje(data.mensajes.length === 0);
      
      // Marcar como leídos los mensajes no leídos
      const noLeidos = data.mensajes
        .filter(m => !m.leido && !m.esPropio)
        .map(m => m.id);
      
      if (noLeidos.length > 0) {
        await apiChat.marcarLeidos(noLeidos);
      }
    } catch (err: any) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    setEnviando(true);
    setError("");

    try {
      // Si es el primer mensaje, usar endpoint especial
      if (esPrimerMensaje) {
        const resultado = await apiChat.primerContacto({
          idDestinatario,
          idPublicacion,
          contenido: mensaje
        });
        
        if (resultado.emailEnviado) {
          console.log('✅ Email enviado al destinatario');
        }
      } else {
        await apiChat.enviarMensaje({
          idDestinatario,
          idPublicacion,
          contenido: mensaje
        });
      }

      setMensaje("");
      setEsPrimerMensaje(false);
      await cargarMensajes();
    } catch (err: any) {
      setError(err.message || "Error al enviar mensaje");
    } finally {
      setEnviando(false);
    }
  };

  return {
    mensajes,
    mensaje,
    setMensaje,
    cargando,
    enviando,
    error,
    esPrimerMensaje,
    enviarMensaje,
  };
};