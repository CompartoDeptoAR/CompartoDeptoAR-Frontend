import { useState } from "react";
import axios from "axios";
import { TokenService } from "../../services/auth/tokenService";

export function useContactanos() {
  const authData = TokenService.getAuthData();

  const [email, setEmail] = useState(authData?.mail || "");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const palabras = mensaje.trim().length > 0
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

    try {
      await axios.post("http://localhost:3000/api/contacto", {
        mail: email,
        mensaje
      });

      setEnviado(true);
      setMensaje("");

    } catch (_) {
      setError("Error al enviar el mensaje. Intenta nuevamente.");
    }
  };

  return {
    email,
    mensaje,
    enviado,
    error,
    palabras,
    setEmail,
    setMensaje,
    setEnviado,
    setError,
    manejarEnvio
  };
}
