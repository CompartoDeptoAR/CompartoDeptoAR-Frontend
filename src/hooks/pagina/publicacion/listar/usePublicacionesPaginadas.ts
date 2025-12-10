import { useState, useCallback } from "react";
import { useToast } from "../../../useToast";
import type { PublicacionResumida } from "../../../../modelos/Publicacion";
import apiPublicacion from "../../../../api/endpoints/publicaciones";

const ITEMS_PER_PAGE = 12;

export const usePublicacionesPaginadas = () => {
  const { showError } = useToast();

  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);


  const cargarPublicaciones = useCallback(
    async (startAfterId?: string) => {
      if (startAfterId) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        
        const data = await apiPublicacion.publicacion.traerPaginadas(
          ITEMS_PER_PAGE,
          startAfterId
        );

        const ultimoId = (data as any).ultId || data.ultId;

        setPublicaciones((prev) =>
          startAfterId ? [...prev, ...data.publicaciones] : data.publicaciones
        );

        setLastId(ultimoId);
        setHasMore(Boolean(ultimoId && data.publicaciones.length > 0));
      } catch (err: any) {
        console.error("❌ Error al cargar publicaciones:", err);
        setError(err.message || "Error al cargar publicaciones");
        showError("Error al cargar las publicaciones");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );


  const cargarMas = useCallback(() => {
    if (lastId && hasMore && !loadingMore) {
      cargarPublicaciones(lastId);
    }
  }, [lastId, hasMore, loadingMore]);

  return {
    publicaciones,
    loading,
    loadingMore,
    error,
    hasMore,
    cargarPublicaciones,
    cargarMas,
  };
};