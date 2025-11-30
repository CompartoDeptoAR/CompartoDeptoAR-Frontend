import { useEffect, useState } from "react";
import type { PublicacionResumida } from "../../../../modelos/Publicacion";
import { useToast } from "../../../useToast";
import apiPublicacion from "../../../../api/endpoints/publicaciones";
import { Navegar } from "../../../../navigation/navigationService";


export const useMisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiPublicacion.publicacion.misPublicaciones();
      setPublicaciones(data);
    } catch (err: any) {
      console.error("Error al cargar publicaciones:", err);
      setError(err.message || "Error al cargar tus publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    Navegar.editarPublicacion(id);
  };

  const handleDelete = async (id: string) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    try {
      await apiPublicacion.publicacion.eliminarPublicacion(id);
      showSuccess("✅ Publicación eliminada exitosamente");
  
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
    } catch (err: any) {
      console.error("Error al eliminar publicación:", err);
      showError(err.message || "❌ Error al eliminar la publicación");
    }
  };

  const handleCrearNueva = () => {
    Navegar.crearPublicacion();
  };

  const handleEstado = async (id: string) => {
    const publicacion = publicaciones.find((p) => p.id === id);
    if (!publicacion) return;

    const nuevoEstado: "activa" | "pausada" =
      publicacion.estado === "activa" ? "pausada" : "activa";

    try {
      await apiPublicacion.publicacion.cambiarEstado(id, nuevoEstado);

      setPublicaciones((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        )
      );

      showSuccess(`✅ Publicación ${nuevoEstado}`);
    } catch (err: any) {
      console.error("Error al cambiar estado:", err);
      showError(err.message || "❌ Error al cambiar el estado de la publicación");
    }
  };

  return {
    publicaciones,
    loading,
    error,
    toast,
    hideToast,
    handleEdit,
    handleDelete,
    handleEstado,
    handleCrearNueva,
    cargarPublicaciones, 
  };
};