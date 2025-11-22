import React, { useEffect, useState, useCallback } from "react";
import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useToast } from "../../../componentes/ToastNotification/useToast";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";

const ITEMS_PER_PAGE = 12;

const TodasLasPublicaciones: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | undefined>();
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast, showSuccess, hideToast } = useToast();

  // Cargar favoritos desde localStorage
  const cargarFavoritos = useCallback(() => {
    try {
      const favoritosGuardados = localStorage.getItem("favoritos");
      if (favoritosGuardados) {
        setFavoritos(JSON.parse(favoritosGuardados));
      }
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
    }
  }, []);

  // Cargar publicaciones con paginación
  const cargarPublicaciones = useCallback(async (startAfterId?: string) => {
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

      setPublicaciones((prev) => 
        startAfterId ? [...prev, ...data.publicaciones] : data.publicaciones
      );

      setLastId(data.lastId);
      setHasMore(!!data.lastId && data.publicaciones.length > 0);
    } catch (err: any) {
      console.error("Error al cargar publicaciones:", err);
      setError(err.message || "Error al cargar las publicaciones");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Toggle favorito
  const handleToggleFavorite = useCallback((id: string) => {
    setFavoritos((prevFavoritos) => {
      const esFavorito = prevFavoritos.includes(id);
      const nuevosFavoritos = esFavorito
        ? prevFavoritos.filter((fav) => fav !== id)
        : [...prevFavoritos, id];

      localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
      showSuccess(esFavorito ? "💔 Eliminado de favoritos" : "❤️ Agregado a favoritos");
      
      return nuevosFavoritos;
    });
  }, [showSuccess]);

  // Cargar más publicaciones
  const cargarMas = useCallback(() => {
    if (lastId && hasMore && !loadingMore) {
      cargarPublicaciones(lastId);
    }
  }, [lastId, hasMore, loadingMore, cargarPublicaciones]);

  // Efecto inicial
  useEffect(() => {
    cargarPublicaciones();
    cargarFavoritos();
  }, [cargarPublicaciones, cargarFavoritos]);

  const totalPublicaciones = publicaciones.length;
  const textoContador = loading
    ? "Cargando..."
    : `${totalPublicaciones} publicación${totalPublicaciones !== 1 ? "es" : ""} disponible${totalPublicaciones !== 1 ? "s" : ""}`;

  return (
    <>
      <div className="container mt-4 mb-5">
        <header className="mb-4">
          <h2 className="mb-1">🏠 Todas las Publicaciones</h2>
          <p className="text-muted mb-0">{textoContador}</p>
        </header>

        <ListarPublicaciones
          publicaciones={publicaciones}
          loading={loading && totalPublicaciones === 0}
          error={error}
          emptyMessage="No hay publicaciones disponibles en este momento"
          showActions={false}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoritos}
        />

        {/* Botón Cargar Más */}
        {hasMore && totalPublicaciones > 0 && (
          <div className="text-center my-5">
            <button
              className="btn btn-outline-primary btn-lg px-5"
              onClick={cargarMas}
              disabled={loadingMore}
              style={{
                borderRadius: "50px",
                fontWeight: "600",
              }}
              aria-label="Cargar más publicaciones"
            >
              {loadingMore ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Cargando más...
                </>
              ) : (
                "⬇️ Cargar más publicaciones"
              )}
            </button>
          </div>
        )}

        {!hasMore && totalPublicaciones > 0 && (
          <div className="text-center text-muted my-5">
            <p className="mb-0">
              🎉 Has visto todas las publicaciones disponibles
            </p>
          </div>
        )}
      </div>

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default TodasLasPublicaciones;