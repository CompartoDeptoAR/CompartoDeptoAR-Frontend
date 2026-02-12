import React, { useEffect, useMemo } from "react";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";

import { useToast } from "../../../hooks/useToast";
import { usePublicacionesPaginadas } from "../../../hooks/pagina/publicacion/listar/usePublicacionesPaginadas";
import { useFavoritos } from "../../../hooks/pagina/favorito/useFavoritos";
import { useLoading } from "../../../contexts/LoadingContext";  

const TodasLasPublicaciones: React.FC = () => {
  const { toast, hideToast } = useToast();
  const { showLoader, hideLoader } = useLoading();                

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
    if (loading) showLoader();
    else hideLoader();
  }, [loading]);

 
  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const total = publicaciones.length;

  return (
    <>
      <div className="container mt-4 mb-5">
        <header className="mb-4">
          <h2 className="mb-1">🏠 Todas las Publicaciones</h2>
        </header>

        <ListarPublicaciones
          publicaciones={publicaciones}
          loading={loading && total === 0}
          loadingMore={loadingMore}
          error={error}
          emptyMessage="No hay publicaciones disponibles"
          hasMore={hasMore}
          onCargarMas={cargarMas}
          favoriteIds={favoritosIds}
          onToggleFavorite={toggleFavorito}
          showActions={false}
        />
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