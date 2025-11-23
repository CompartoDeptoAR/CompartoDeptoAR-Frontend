import { useEffect, useState, useCallback } from "react";
import { useToast } from "../useToast";
import { useGlobalLoader } from "../sistema/useGlobalLoader";
import { LocalStorageService, STORAGE_KEYS } from "../../services/storage/localStorage.service";
import apiFavorito from "../../api/endpoints/favoritos";
import { Navigation } from "../../navigation/navigationService";



export const useFavoritos = () => {
  const { showError, showSuccess, showToastWithAction } = useToast();
  const { showLoader, hideLoader } = useGlobalLoader();

  const usuarioId = LocalStorageService.get(STORAGE_KEYS.USER_ID);

  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  
  /** Cargar favoritos desde la API */
  const cargarFavoritos = useCallback(async () => {
    if (!usuarioId) {
      setFavoritos([]);
      setLoadingFavoritos(false);
      return;
    }

    try {
      showLoader();
      const data = await apiFavorito.favorito.listarFavoritos();
      setFavoritos(data.map((fav) => fav.id));
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      showError("No se pudieron cargar tus favoritos");
    } finally {
      hideLoader();
      setLoadingFavoritos(false);
    }
  }, [usuarioId]);

  /** Alternar favorito */
  const toggleFavorito = useCallback(
    async (publicacionId: string) => {
      if (!usuarioId) {
            showToastWithAction(
                "Debes iniciar sesión para usar favoritos",
                "info",
                "Iniciar sesión",
                () => Navigation.auth()
            );
            return;
        }

      const esFavorito = favoritos.includes(publicacionId);

      try {
        showLoader();

        if (esFavorito) {
          await apiFavorito.favorito.eliminarFavorito(publicacionId);
          setFavoritos((prev) => prev.filter((id) => id !== publicacionId));
          showSuccess("💔 Eliminado de favoritos");
        } else {
          await apiFavorito.favorito.agregarFavorito(publicacionId);
          setFavoritos((prev) => [...prev, publicacionId]);
          showSuccess("❤️ Agregado a favoritos");
        }
      } catch (err) {
        console.error("Error al cambiar favorito:", err);
        showError("Error al modificar favorito");
      } finally {
        hideLoader();
      }
    },
    [favoritos, usuarioId]
  );

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  return {
    favoritos,
    loadingFavoritos,
    toggleFavorito,
    cargarFavoritos,
    usuarioId,
  };
};
