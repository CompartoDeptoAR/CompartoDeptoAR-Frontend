import React from "react";
import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { Button } from "react-bootstrap";

interface MiniListarPublicacionesProps {
  publicaciones: PublicacionResumida[];
  onToggleFavorite?: (id: string) => void;
  favoriteIds?: string[];
}

const MiniListarPublicaciones: React.FC<MiniListarPublicacionesProps> = ({
  publicaciones,
  onToggleFavorite,
  favoriteIds = [],
}) => {
  if (publicaciones.length === 0) {
    return <p className="text-muted">No hay publicaciones para mostrar</p>;
  }

  return (
    <div className="d-flex gap-3 overflow-auto py-2">
      {publicaciones.map((pub) => (
        <div
          key={pub.id}
          className="card flex-shrink-0"
          style={{ minWidth: "180px" }}
        >
          {pub.foto && (
            <img
              src={pub.foto}
              className="card-img-top"
              alt={pub.titulo}
              style={{ height: "120px", objectFit: "cover" }}
            />
          )}
          <div className="card-body p-2">
            <h6 className="card-title mb-1">{pub.titulo}</h6>
            <p className="card-text mb-1 text-muted">${pub.precio}</p>
            {onToggleFavorite && (
              <Button
                size="sm"
                variant={favoriteIds.includes(pub.id) ? "danger" : "outline-danger"}
                onClick={() => onToggleFavorite(pub.id)}
              >
                {favoriteIds.includes(pub.id) ? "💔" : "❤️"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MiniListarPublicaciones;
