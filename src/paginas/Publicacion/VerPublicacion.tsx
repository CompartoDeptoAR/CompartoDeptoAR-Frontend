import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ToastNotification from "../../componentes/ToastNotification/ToastNotification";
import apiPublicacion from "../../api/endpoints/publicaciones";
import apiCalificacion from "../../api/endpoints/calificacion";
import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";
import type { PublicacionResponce } from "../../modelos/Publicacion";
import { useToast } from "../../componentes/ToastNotification/useToast";
import FormularioPublicacionView from "../../componentes/FormularioPublicacion/FormularioPublicacionView";

const VerPublicacion = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();

  const [publicacion, setPublicacion] = useState<PublicacionResponce | null>(null);
  const [promedio, setPromedio] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const usuarioActualId = LocalStorageService.get(STORAGE_KEYS.USER_ID);

  useEffect(() => {
    if (!id) {
      showError("No se encontró la publicación");
      navigate("/");
      return;
    }

    fetchPublicacion();
    fetchPromedio();
  }, [id]);

  const fetchPublicacion = async () => {
    try {
      const data: PublicacionResponce = await apiPublicacion.publicacion.obtener(id!);
      setPublicacion(data);
    } catch (err: any) {
      console.error("Error cargando publicación:", err);
      showError("No se pudo cargar la publicación");
      setTimeout(() => navigate("/"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromedio = async () => {
    try {
      if (!id) return;
      const prom = await apiCalificacion.calificacion.obtenerPromedio(id);
      setPromedio(prom);
    } catch (err) {
      console.error("Error cargando promedio:", err);
      setPromedio(0);
    }
  };

  const handleContactar = () => {
    if (!usuarioActualId) {
      showInfo("Debes iniciar sesión para contactar al anunciante");
      setTimeout(() => navigate("/auth/login"), 1500);
      return;
    }

    if (publicacion?.usuarioId === usuarioActualId) {
      showInfo("No puedes contactarte a ti mismo");
      return;
    }


    navigate(`/chat/${publicacion?.usuarioId}`);
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

      // Recargar promedio
      fetchPromedio();
    } catch (err: any) {
      console.error("Error al enviar calificación:", err);
      showError(err.message || "No se pudo enviar la calificación");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando publicación...</p>
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Publicación no encontrada</h4>
          <p>La publicación que buscas no existe o ha sido eliminada.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const puedeCalificar =usuarioActualId && usuarioActualId !== publicacion.usuarioId;

  return (
    <>
      <FormularioPublicacionView
        publicacion={publicacion}
        nombreUsuario={publicacion.nombreUsuario || "Usuario"}
        usuarioId={publicacion.usuarioId!}
        calificacionPromedio={promedio}
        onContactar={handleContactar}
      />

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default VerPublicacion;