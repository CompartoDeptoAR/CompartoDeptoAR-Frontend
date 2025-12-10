import { useState } from "react";
import { TokenService } from "../../../services/auth/tokenService";

export interface UseFormularioContactoConfig {
  enviarFn: (data: { mail: string; mensaje: string }) => Promise<any>;
  maxPalabras?: number;
  emailRequerido?: boolean;
}

export interface FormularioContactoReturn {
  email: string;
  mensaje: string;
  enviado: boolean;
  error: string;
  palabras: number;
  cargando: boolean;
  emailBloqueado: boolean;
  setEmail: (email: string) => void;
  setMensaje: (mensaje: string) => void;
  resetEnviado: () => void;
  resetError: () => void;
  manejarEnvio: (e: React.FormEvent) => Promise<void>;
}

export function useFormularioContacto(
  config: UseFormularioContactoConfig
): FormularioContactoReturn {
  const { enviarFn, maxPalabras = 300, emailRequerido = true } = config;
  
  const emailUsuario = TokenService.getUserEmail();
  const emailInicial = emailUsuario || "";

  const [email, setEmail] = useState(emailInicial);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const emailBloqueado = !!emailUsuario;

  const palabras =
    mensaje.trim().length > 0 ? mensaje.trim().split(/\s+/).length : 0;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      setError("El mensaje no puede estar vacío.");
      return;
    }

    if (palabras > maxPalabras) {
      setError(`El mensaje no puede superar las ${maxPalabras} palabras.`);
      return;
    }

    if (emailRequerido && !email.trim()) {
      setError("El correo es requerido.");
      return;
    }

    setError("");
    setCargando(true);

    try {
      const respuesta = await enviarFn({
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
      setError(
        err.message || "Error al enviar el mensaje. Intenta nuevamente."
      );
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