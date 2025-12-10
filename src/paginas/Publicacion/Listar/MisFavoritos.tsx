import React, { useEffect } from "react";
import { useFavoritos } from "../../../hooks/pagina/favorito/useFavoritos";
import { useToast } from "../../../hooks/useToast";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useLoading } from "../../../contexts/LoadingContext";



const MisFavoritos: React.FC = () => {
  const {
    favoritos,
    loading,
    error,
    eliminarFavorito,
    limpiarTodosFavoritos,
    cantidadFavoritos
  } = useFavoritos();

  const { toast, hideToast } = useToast();
  const { showLoader, hideLoader } = useLoading();

  const handleToggleFavorite = async (id: string) => {
    await eliminarFavorito(id);
  };

  const handleLimpiarTodo = async () => {
    await limpiarTodosFavoritos();
  };


  useEffect(() => {
      if (loading) showLoader();
      else hideLoader();
    }, [loading]);
  return (
    <>
      <div className="container mt-4 mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="mb-1">❤️ Mis Favoritos</h2>
            <p className="text-muted mb-0">
              {loading
                ? "Cargando..."
                : cantidadFavoritos === 0
                ? "No tienes favoritos guardados"
                : `${cantidadFavoritos} publicación${cantidadFavoritos !== 1 ? "es" : ""} guardada${cantidadFavoritos !== 1 ? "s" : ""}`}
            </p>
          </div>
          
          {cantidadFavoritos > 0 && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger"
                onClick={handleLimpiarTodo}
                disabled={loading}
              >
                🗑️ Limpiar todo
              </button>
            </div>
          )}
        </div>

        <ListarPublicaciones
          publicaciones={favoritos}
          loading={loading}
          error={error}
          emptyMessage="Aún no tienes favoritos. ¡Explora publicaciones y guarda las que te gusten!"
          showActions={false}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoritos.map(pub => pub.id)}
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

export default MisFavoritos;