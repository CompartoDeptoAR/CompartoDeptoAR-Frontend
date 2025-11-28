import React from "react";
import "./ListarPublicacion.css";
import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useListarPublicaciones } from "../../hooks/publicacion/useListarPublicaciones";
import CartaPublicacion from "../componenteSecundario/CartaPublicacion";

interface ListarPublicacionesProps {
  publicaciones: PublicacionResumida[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  favoriteIds?: string[];
}

const ListarPublicaciones: React.FC<ListarPublicacionesProps> = ({
  publicaciones,
  loading = false,
  error,
  emptyMessage = "No hay publicaciones disponibles",
  showActions = false,
  onEdit,
  onDelete,
  onToggleFavorite,
  favoriteIds = [],
}) => {
  const {
    handleVerDetalle,
    handleEdit,
    handleDelete,
    handleToggleFavorite,
    isFavorite,
  } = useListarPublicaciones({
    onEdit,
    onDelete,
    onToggleFavorite,
    favoriteIds,
  });

  if (loading) {
    return null
    /*
    (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando publicaciones...</p>
      </div>
    );*/
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>❌ Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!publicaciones || publicaciones.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">
          <h4>📭 {emptyMessage}</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {publicaciones.map((pub) => (
          <div key={pub.id} className="col-12 col-md-6 col-lg-4">
            <CartaPublicacion
              publicacion={pub}
              showActions={showActions}
              isFavorite={isFavorite(pub.id)}
              onEdit={() => handleEdit(pub.id)}
              onDelete={() => handleDelete(pub.id)}
              onToggleFavorite={() => handleToggleFavorite(pub.id)}
              onVerDetalles={()=>handleVerDetalle(pub.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarPublicaciones;
