
import React from "react";
import { useNavigate } from "react-router-dom";

import "../../../styles/CartaPublicacion.css";
import type { EstadoPublicacion, PublicacionResumida } from "../../../modelos/Publicacion";

interface CartaPublicacionProps {
  publicacion: PublicacionResumida;
  showActions?: boolean;
  isFavorite?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const CartaPublicacion: React.FC<CartaPublicacionProps> = ({
  publicacion,
  showActions = false,
  isFavorite = false,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleVerDetalle = () => {
    navigate(`/publicacion/${publicacion.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(publicacion.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(publicacion.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(publicacion.id);
  };

  const getEstadoBadge = (estado: EstadoPublicacion) => {
    const badges = {
      activa: { class: "bg-success", text: "✓ Activa" },
      pausada: { class: "bg-warning text-dark", text: "⏸ Pausada" },
      inactiva: { class: "bg-secondary", text: "⊗ Inactiva" },
    };
    return badges[estado] || badges.activa;
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const imagenUrl = publicacion.foto || "https://via.placeholder.com/400x300?text=Sin+Imagen";
  const estadoBadge = getEstadoBadge(publicacion.estado);

  return (
    <div
      className="carta-publicacion card h-100 shadow-sm"
      onClick={handleVerDetalle}
    >
      {/* Imagen */}
      <div className="carta-publicacion__imagen-container position-relative">
        <img
          src={imagenUrl}
          className="card-img-top carta-publicacion__imagen"
          alt={publicacion.titulo}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300?text=Sin+Imagen";
          }}
        />

        {/* Badge de precio */}
        <span className="badge bg-success carta-publicacion__precio">
          ${publicacion.precio.toLocaleString("es-AR")}
        </span>

        {/* Botón de favorito */}
        {onToggleFavorite && (
          <button
            className="btn btn-light carta-publicacion__favorito"
            onClick={handleToggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        )}

        {/* Badge de estado (solo en Mis Publicaciones) */}
        {showActions && (
          <span className={`badge ${estadoBadge.class} carta-publicacion__estado`}>
            {estadoBadge.text}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title carta-publicacion__titulo" title={publicacion.titulo}>
          {publicacion.titulo}
        </h5>

        <p className="text-muted small carta-publicacion__fecha">
          📅 {formatFecha(publicacion.createdAt)}
        </p>

        {/* Acciones (solo para Mis Publicaciones) */}
        {showActions && (
          <div className="mt-auto pt-2 d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary flex-fill"
              onClick={handleEdit}
              title="Editar publicación"
            >
              ✏️ Editar
            </button>
            <button
              className="btn btn-sm btn-outline-danger flex-fill"
              onClick={handleDelete}
              title="Eliminar publicación"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}

        {/* Botón Ver Detalles (para otras vistas) */}
        {!showActions && (
          <button className="btn btn-primary btn-sm mt-auto" onClick={handleVerDetalle}>
            Ver detalles →
          </button>
        )}
      </div>
    </div>
  );
};

export default CartaPublicacion;