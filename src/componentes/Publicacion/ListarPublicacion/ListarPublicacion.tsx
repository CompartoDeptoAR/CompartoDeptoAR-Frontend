import React from "react";
import "../../../styles/ListarPublicacion.css";
import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useListarPublicaciones } from "../../../hooks/componente/publicacion/useListarPublicaciones";
import CartaPublicacion from "../componenteSecundario/CartaPublicacion";

interface ListarPublicacionesProps {
  publicaciones: PublicacionResumida[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEstado?: (id: string, nuevoEstado: "activa" | "pausada") => void;
  onToggleFavorite?: (id: string) => void;
  favoriteIds?: string[];
}

const ListarPublicaciones: React.FC<ListarPublicacionesProps> = ({
  publicaciones = [],
  loading = false,
  error,
  emptyMessage = "No hay publicaciones disponibles",
  showActions = false,
  onEdit,
  onDelete,
  onEstado,
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

 
  const handleEstadoClick = (id: string) => {
    if (!onEstado) return;
    
    const publicacion = publicaciones.find(p => p.id === id);
    if (!publicacion) return;
    
    const nuevoEstado = publicacion.estado === "activa" ? "pausada" : "activa";
    onEstado(id, nuevoEstado);
  };

  if (loading) {
    return <></>; 
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
              onEstado={() => handleEstadoClick(pub.id)} 
              onToggleFavorite={() => handleToggleFavorite(pub.id)}
              onVerDetalles={() => handleVerDetalle(pub.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarPublicaciones;