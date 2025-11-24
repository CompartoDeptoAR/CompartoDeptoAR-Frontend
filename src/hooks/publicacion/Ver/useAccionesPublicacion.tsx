import apiCalificacion from "../../../api/endpoints/calificacion";
import { useToast } from "../../useToast";
import { Navegar } from "../../../navigation/navigationService";
import { LocalStorageService, STORAGE_KEYS } from "../../../services/storage/localStorage.service";

export const useAccionesPublicacion = (publicacion: any, fetchPromedio: () => void) => {
  const usuarioActualId = LocalStorageService.get(STORAGE_KEYS.USER_ID);
  const { showError, showSuccess, showInfo } = useToast();

  const handleContactar = () => {
    if (!usuarioActualId) {
      showInfo("Debes iniciar sesión para contactar al anunciante");
      setTimeout(() => Navegar.auth(), 1500);
      return;
    }

    if (publicacion?.usuarioId === usuarioActualId) {
      showInfo("No puedes contactarte a ti mismo");
      return;
    }

    Navegar.chat(publicacion?.usuarioId!);
  };

  const handleSubmitCalificacion = async (calificacion: number, comentario: string) => {
    if (!usuarioActualId) {
      showError("Debes iniciar sesión para calificar");
      return;
    }

    if (publicacion?.usuarioId === usuarioActualId) {
      showError("No puedes calificarte a ti mismo");
      return;
    }

    try {
      await apiCalificacion.calificacion.crear({
        idCalificado: publicacion!.usuarioId!,
        puntuacion: calificacion,
        comentario,
      });

      showSuccess("¡Calificación enviada exitosamente!");
      fetchPromedio(); // Recargar promedio
    } catch (err: any) {
      console.error("Error al enviar calificación:", err);
      showError(err.message || "No se pudo enviar la calificación");
    }
  };

  return {
    usuarioActualId,
    handleContactar,
    handleSubmitCalificacion,
  };
};
