import { useState } from "react";
import { TokenService } from "../../../services/auth/tokenService";
import apiContacto from "../../../api/endpoints/contacto";

export interface ContactanosReturn {
  email: string;
  mensaje: string;
  enviado: boolean;
  error: string;
  palabras: number;
  cargando: boolean;

  emailBloqueado: boolean; // ⬅ NUEVO

  setEmail: (email: string) => void;
  setMensaje: (mensaje: string) => void;
  resetEnviado: () => void;
  resetError: () => void;
  manejarEnvio: (e: React.FormEvent) => Promise<void>;
}

export function useContactanos(): ContactanosReturn {

  const emailUsuario = TokenService.getUserEmail(); 
  const emailInicial = emailUsuario || "";

  const [email, setEmail] = useState(emailInicial);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const emailBloqueado = !!emailUsuario; // ⬅ si hay usuario logueado → input disabled

  const palabras =
    mensaje.trim().length > 0
      ? mensaje.trim().split(/\s+/).length
      : 0;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      setError("El mensaje no puede estar vacío.");
      return;
    }

    if (palabras > 300) {
      setError("El mensaje no puede superar las 300 palabras.");
      return;
    }

    setError("");
    setCargando(true);

    try {
      const respuesta = await apiContacto.contacto.enviarMensaje({
        mail: email,
        mensaje: mensaje.trim(),
      });

      setEnviado(true);
      setMensaje("");

      if (respuesta.mensaje) {
        console.log(respuesta.mensaje);
      }

    } catch (err: any) {
      console.error("Error al enviar mensaje:", err);
      setError(err.message || "Error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return {
    email,
    mensaje,
    enviado,
    error,
    palabras,
    cargando,

    emailBloqueado, 

    setEmail,
    setMensaje,
    resetEnviado: () => setEnviado(false),
    resetError: () => setError(""),
    manejarEnvio,
  };
}
