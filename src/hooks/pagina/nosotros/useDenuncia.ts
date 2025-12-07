import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import apiDenuncia from "../../../api/endpoints/denuncia";
import { TokenService } from "../../../services/auth/tokenService";
import { Reporte } from "../../../modelos/Reporte";

interface DatosDenuncia {
  tipo: "publicacion" | "mensaje";
  id: string;
  motivo: string;
  descripcion: string;
}

export const useDenuncia = () => {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const userId = TokenService.getUserId();
  const userEmail = TokenService.getUserEmail();
  const emailBloqueado = !!userEmail;

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const resetEnviado = () => setEnviado(false);
  const resetError = () => setError("");

  const manejarEnvio = async (datos: DatosDenuncia) => {
    // Validaciones
    if (!email) {
      setError("Por favor ingresá tu correo electrónico");
      return;
    }

    if (!datos.id.trim()) {
      setError("Por favor ingresá el ID del contenido a denunciar");
      return;
    }

    if (!datos.motivo) {
      setError("Por favor seleccioná un motivo");
      return;
    }

    if (!datos.descripcion.trim()) {
      setError("Por favor describí el motivo de la denuncia");
      return;
    }

    setCargando(true);
    setError("");

    try {

      const nuevoReporte:Reporte = {
        tipo: datos.tipo,
        idContenido: datos.id.trim(),
        motivo: datos.motivo,
        descripcion: datos.descripcion.trim(),
        reportanteId: userId || undefined,
        fechaReporte: Timestamp.now(),
        revisado: false,
      };

      await apiDenuncia.denuncia.enviarDenuncia(nuevoReporte);
      
      setEnviado(true);

      setTimeout(() => {
        setEnviado(false);
      }, 3000);
      
    } catch (err: any) {
      console.error("Error al enviar denuncia:", err);
      setError(err.message || "Hubo un error al enviar la denuncia. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return {
    email,
    cargando,
    enviado,
    error,
    emailBloqueado,
    setEmail,
    resetEnviado,
    resetError,
    manejarEnvio,
  };
};