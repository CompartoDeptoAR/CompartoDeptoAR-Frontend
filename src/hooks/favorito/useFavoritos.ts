import { useState, useEffect, useCallback } from "react";
import type { PublicacionResumida } from "../../modelos/Publicacion";
import { useToast } from "../useToast";
import apiFavorito from "../../api/endpoints/favoritos";
import { TokenService } from "../../services/auth/tokenService";


export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { showSuccess, showError } = useToast();

  const cargarFavoritos = useCallback(async () => {
    // Si no está autenticado, no hacer la petición
    if (!TokenService.isAuthenticated()) {
      setFavoritos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const publicacionesData = (await apiFavorito.favorito.listarFavoritos()).publicaciones;
      setFavoritos(publicacionesData);
    } catch (err: any) {
      console.error("Error al cargar favoritos:", err);
      const mensajeError = err.message || "Error al cargar tus favoritos";
      setError(mensajeError);
      // No mostrar error si es un 401 (no autenticado)
      if (err.status !== 401) {
        showError(mensajeError);
      }
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const agregarFavorito = useCallback(async (publicacionId: string) => {
    if (!TokenService.isAuthenticated()) {
      showError("Debes iniciar sesión para agregar favoritos");
      return false;
    }

    try {
      await apiFavorito.favorito.agregarFavorito(publicacionId);
      showSuccess("❤️ Agregado a favoritos");
      await cargarFavoritos(); 
      return true;
    } catch (err: any) {
      console.error("Error al agregar favorito:", err);
      showError("Error al agregar a favoritos");
      return false;
    }
  }, [showSuccess, showError, cargarFavoritos]);

  const eliminarFavorito = useCallback(async (publicacionId: string) => {
    if (!TokenService.isAuthenticated()) {
      showError("Debes iniciar sesión para eliminar favoritos");
      return false;
    }

    try {
      await apiFavorito.favorito.eliminarFavorito(publicacionId);
      
      setFavoritos((prev) => prev.filter((pub) => pub.id !== publicacionId));
      
      showSuccess("💔 Eliminado de favoritos");
      return true;
    } catch (err: any) {
      console.error("Error al eliminar favorito:", err);
      showError("Error al eliminar de favoritos");
      return false;
    }
  }, [showSuccess, showError]);

  const toggleFavorito = async (id: string) => {
    if (!TokenService.isAuthenticated()) {
      showError("Debes iniciar sesión para gestionar favoritos");
      return;
    }

    const esFavorito = favoritos.some(p => p.id === id);

    if (esFavorito) {
      await eliminarFavorito(id);
    } else {
      await agregarFavorito(id);
    }
  };

  const limpiarTodosFavoritos = useCallback(async () => {
    if (!TokenService.isAuthenticated()) {
      showError("Debes iniciar sesión para limpiar favoritos");
      return false;
    }

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar todo/s tus ${favoritos.length} favoritos? Esta acción no se puede deshacer.`
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
  }, [favoritos, showSuccess, showError]);

  const verificarEsFavorito = useCallback(async (publicacionId: string): Promise<boolean> => {
    if (!TokenService.isAuthenticated()) return false;

    try {
      return await apiFavorito.favorito.esFavorito(publicacionId);
    } catch (err) {
      console.error("Error al verificar favorito:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

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
    isAuthenticated: TokenService.isAuthenticated() // Exportar para que los componentes sepan si está autenticado
  };
};