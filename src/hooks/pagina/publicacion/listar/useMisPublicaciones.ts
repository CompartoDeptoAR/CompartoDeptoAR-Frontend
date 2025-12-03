
import { useState, useEffect, useCallback } from "react";
import apiPublicacion from "../../../../api/endpoints/publicaciones";
import { useToast } from "../../../../hooks/useToast";
import { TokenService } from "../../../../services/auth/tokenService";
import { Navegar } from "../../../../navigation/navigationService";
import type { Publicacion, PublicacionResumida } from "../../../../modelos/Publicacion";

export const useMisPublicaciones = () => {
  const { showSuccess, showError } = useToast();
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" as const });

  const fetchMisPublicaciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usuarioId = TokenService.getUserId();
      
      if (!usuarioId) {
        setError("Usuario no autenticado");
        showError("Debes iniciar sesión para ver tus publicaciones");
        setTimeout(() => Navegar.auth(), 2000);
        return;
      }

      const data = await apiPublicacion.publicacion.misPublicaciones(usuarioId);
      setPublicaciones(data);
      
    } catch (err: any) {
      console.error("Error al obtener publicaciones:", err);
      setError(err.message || "Error al cargar publicaciones");
      showError(err.message || "No se pudieron cargar tus publicaciones");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchMisPublicaciones();
  }, [fetchMisPublicaciones]);

  const handleEdit = (id: string) => {
    Navegar.editarPublicacion(id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
      try {
        const isAuthenticated = TokenService.isAuthenticated();
        if (isAuthenticated) {
          showError("No estás autenticado");
          return;
        }
        
        await apiPublicacion.publicacion.eliminarPublicacion(id);
        showSuccess("Publicación eliminada correctamente");
        fetchMisPublicaciones();
      } catch (err: any) {
        showError(err.message || "Error al eliminar publicación");
      }
    }
  };
 /*
  const handleEstado = async (id: string, nuevoEstado: "activa" | "pausada") => {
    try {
      await apiPublicacion.publicacion.cambiarEstado(id, nuevoEstado);
      showSuccess(`Estado cambiado a ${nuevoEstado}`);
      fetchMisPublicaciones();
    } catch (err: any) {
      showError(err.message || "Error al cambiar estado");
    }
  };
*/ 
  const handleEstado = async (id: string, nuevoEstado: "activa" | "pausada") => {
      //depus lo uso en favoritos
      setPublicaciones(prev =>
        prev.map(p =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        )
      );

      try {
    
        await apiPublicacion.publicacion.cambiarEstado(id, nuevoEstado);
        showSuccess(`Estado cambiado a ${nuevoEstado}`);
      } catch (err: any) {
        showError(err.message || "Error al cambiar estado");

        setPublicaciones(prev =>
          prev.map(p =>
            p.id === id
              ? { ...p, estado: nuevoEstado === "activa" ? "pausada" : "activa" }
              : p
          )
        );
      }
    };

  const handleCrearNueva = () => {
    Navegar.crearPublicacion();
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
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
    refresh: fetchMisPublicaciones
  };
};