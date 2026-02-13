import { useState, useEffect, useCallback } from "react";
import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useToast } from "../../useToast";
import apiFavorito from "../../../services/api/endpoints/favoritos";
import { TokenService } from "../../../services/auth/tokenService";

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showSuccess, showError } = useToast();

  const cargarFavoritos = useCallback(async () => {
    if (!TokenService.isAuthenticated()) {
      setFavoritos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const publicacionesData =
        (await apiFavorito.favorito.listarFavoritos()).publicaciones;

      const publicacionesLimpias: PublicacionResumida[] =
        publicacionesData.map((pub: any) => ({
          ...pub,
        }));

      setFavoritos(publicacionesLimpias);
    } catch (err: any) {
      console.error("Error al cargar favoritos:", err);
      const mensajeError =
        err.message || "Error al cargar tus favoritos";
      setError(mensajeError);

      if (err.status !== 401) {
        showError(mensajeError);
      }
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const agregarFavorito = useCallback(
    async (publicacionId: string) => {
      if (!TokenService.isAuthenticated()) {
        showError("Debes iniciar sesión para agregar favoritos");
        return false;
      }

      try {
        const nuevaPublicacion = { id: publicacionId } as PublicacionResumida;
        setFavoritos((prev) => [...prev, nuevaPublicacion]);
        
        await apiFavorito.favorito.agregarFavorito(publicacionId);
        showSuccess("❤️ Agregado a favoritos");
        
        return true;
      } catch (err: any) {
        console.error("Error al agregar favorito:", err);
        setFavoritos((prev) => prev.filter((p) => p.id !== publicacionId));
        showError("Error al agregar a favoritos");
        return false;
      }
    },
    [showSuccess, showError]
  );

  const eliminarFavorito = useCallback(
    async (publicacionId: string) => {
      if (!TokenService.isAuthenticated()) {
        showError("Debes iniciar sesión para eliminar favoritos");
        return false;
      }

      try {
        setFavoritos((prev) =>
          prev.filter((pub) => pub.id !== publicacionId)
        );
        
        await apiFavorito.favorito.eliminarFavorito(publicacionId);
        showSuccess("💔 Eliminado de favoritos");
        return true;
      } catch (err: any) {
        console.error("Error al eliminar favorito:", err);

        await cargarFavoritos();
        showError("Error al eliminar de favoritos");
        return false;
      }
    },
    [showSuccess, showError, cargarFavoritos]
  );

  const toggleFavorito = async (id: string) => {
    if (!TokenService.isAuthenticated()) {
      showError("Debes iniciar sesión para gestionar favoritos");
      return;
    }

    const esFavorito = favoritos.some((p) => p.id === id);

    if (esFavorito) {
      await eliminarFavorito(id);
    } else {
      await agregarFavorito(id);
    }
  };

  const limpiarTodosFavoritos = useCallback(
    async () => {
      if (!TokenService.isAuthenticated()) {
        showError("Debes iniciar sesión para limpiar favoritos");
        return false;
      }

      const confirmar = window.confirm(
        `¿Estás seguro de que deseas eliminar todos tus ${favoritos.length} favoritos? Esta acción no se puede deshacer.`
      );

      if (!confirmar) return false;

      try {
        const promesas = favoritos.map((pub) =>
          apiFavorito.favorito.eliminarFavorito(pub.id)
        );

        await Promise.all(promesas);

        setFavoritos([]);
        showSuccess("🗑️ Todos los favoritos han sido eliminados");
        return true;
      } catch (err: any) {
        console.error("Error al limpiar favoritos:", err);
        showError("Error al limpiar favoritos");
        return false;
      }
    },
    [favoritos, showSuccess, showError]
  );

  const verificarEsFavorito = useCallback(
    (publicacionId: string): boolean => {
      return favoritos.some((p) => p.id === publicacionId);
    },
    [favoritos]
  );

  useEffect(() => {
    const init = async () => {
      await cargarFavoritos();
    };

    init();
  }, []);

  return {
    favoritos,
    loading,
    error,
    cargarFavoritos,
    agregarFavorito,
    eliminarFavorito,
    toggleFavorito,
    limpiarTodosFavoritos,
    verificarEsFavorito,
    cantidadFavoritos: favoritos.length,
    isAuthenticated: TokenService.isAuthenticated(),
  };
};