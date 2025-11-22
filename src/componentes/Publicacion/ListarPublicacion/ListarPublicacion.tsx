import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListarPublicacion.css";
import type { PublicacionResumida } from "../../../modelos/Publicacion";

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
  const navigate = useNavigate();

  if (loading) {
    return (
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
    );
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

  const handleVerDetalle = (id: string) => {
    navigate(`/publicacion/${id}`);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(id);
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {publicaciones.map((pub) => {
          // El backend devuelve foto como array de strings
          const primeraFoto = Array.isArray(pub.foto) && pub.foto.length > 0
            ? pub.foto[0]
            : "https://via.placeholder.com/400x300?text=Sin+Imagen";

          return (
            <div key={pub.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm publicacion-card"
                onClick={() => handleVerDetalle(pub.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Imagen */}
                <div className="position-relative">
                  <img
                    src={primeraFoto}
                    className="card-img-top"
                    alt={pub.titulo}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Sin+Imagen";
                    }}
                  />
                  
                  {/* Badge de precio */}
                  <span className="badge bg-success position-absolute top-0 end-0 m-2 fs-6">
                    ${pub.precio?.toLocaleString("es-AR")}
                  </span>

                  {/* Botón de favorito */}
                  {onToggleFavorite && (
                    <button
                      className="btn btn-light position-absolute top-0 start-0 m-2 rounded-circle"
                      onClick={(e) => handleToggleFavorite(e, pub.id)}
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: "0",
                      }}
                    >
                      {isFavorite(pub.id) ? "❤️" : "🤍"}
                    </button>
                  )}
                </div>

                {/* Contenido */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate" title={pub.titulo}>
                    {pub.titulo}
                  </h5>

                  {/* Ubicación */}
                  <p className="text-muted small mb-2">
                    📍 {pub.ubicacion}
                  </p>

                  {/* Acciones (solo para Mis Publicaciones) */}
                  {showActions && (
                    <div className="mt-auto pt-2 d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary flex-fill"
                        onClick={(e) => handleEdit(e, pub.id)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger flex-fill"
                        onClick={(e) => handleDelete(e, pub.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}

                  {/* Botón Ver Detalles (para todas) */}
                  {!showActions && (
                    <button
                      className="btn btn-primary btn-sm mt-auto"
                      onClick={() => handleVerDetalle(pub.id)}
                    >
                      Ver detalles →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListarPublicaciones;