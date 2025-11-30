import React, { useEffect, useMemo } from "react";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";

import { useToast } from "../../../hooks/useToast";
import { usePublicacionesPaginadas } from "../../../hooks/pagina/publicacion/listar/usePublicacionesPaginadas";
import { useFavoritos } from "../../../hooks/pagina/favorito/useFavoritos";

const TodasLasPublicaciones: React.FC = () => {
  const { toast, hideToast } = useToast();
  const {
    publicaciones,
    loading,
    error,
    hasMore,
    cargarPublicaciones,
    cargarMas,
    loadingMore,
  } = usePublicacionesPaginadas();

  const { favoritos, toggleFavorito } = useFavoritos();

  const favoritosIds = useMemo(() => {
    return favoritos.map(pub => pub.id);
  }, [favoritos]);

  useEffect(() => {
    cargarPublicaciones();
  }, []);
  
  const total = publicaciones.length;

  return (
    <>
      <div className="container mt-4 mb-5">
        <header className="mb-4">
          <h2 className="mb-1">🏠 Todas las Publicaciones</h2>
          <p className="text-muted mb-0">
            {loading ? "" : `${total} publicaciones`}
          </p>
        </header>

        <ListarPublicaciones
          publicaciones={publicaciones}
          loading={loading && total === 0}
          error={error}
          emptyMessage="No hay publicaciones disponibles"
          favoriteIds={favoritosIds}
          onToggleFavorite={toggleFavorito}
          showActions={false}
        />

        {hasMore && total > 0 && (
          <div className="text-center my-5">
            <button
              className="btn btn-outline-primary btn-lg px-5"
              onClick={cargarMas}
              disabled={loadingMore}
            >
              {loadingMore ? "Cargando..." : "Cargar más"}
            </button>
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