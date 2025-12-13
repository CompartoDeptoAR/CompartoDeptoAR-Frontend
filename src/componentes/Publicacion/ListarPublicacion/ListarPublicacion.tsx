import React from "react";
import { Spinner, Button } from "react-bootstrap";
import { ChevronDown } from "lucide-react";
import "../../../styles/ListarPublicacion.css";
import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useListarPublicaciones } from "../../../hooks/componente/publicacion/useListarPublicaciones";
import CartaPublicacion from "../componenteSecundario/CartaPublicacion";

interface ListarPublicacionesProps {
  publicaciones: PublicacionResumida[];
  loading?: boolean;
  loadingMore?: boolean;
  error?: string;
  emptyMessage?: string;
  showActions?: boolean;
  hasMore?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEstado?: (id: string, nuevoEstado: "activa" | "pausada") => void;
  onToggleFavorite?: (id: string) => void;
  onCargarMas?: () => void;
  favoriteIds?: string[];
}

const ListarPublicaciones: React.FC<ListarPublicacionesProps> = ({
  publicaciones = [],
  loading = false,
  loadingMore = false,
  error,
  emptyMessage = "No hay publicaciones disponibles",
  showActions = false,
  hasMore = false,
  onEdit,
  onDelete,
  onEstado,
  onToggleFavorite,
  onCargarMas,
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

  if (loading) return <></>;

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
    <div className="publicaciones-container">
      <div className="publicaciones-grid">
        {publicaciones.map((pub) => (
          <div key={pub.id} className="publicacion-card-wrapper">
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

      {/* Controles de paginación */}
      {(hasMore || loadingMore) && (
        <div className="paginacion-container">
          {loadingMore ? (
            <div className="loading-state">
              <Spinner animation="border" variant="primary" />
              <small className="text-muted mt-2">Cargando más publicaciones...</small>
            </div>
          ) : hasMore ? (
            <Button
              onClick={onCargarMas}
              className="btn-cargar-mas"
            >
              <span>Cargar más publicaciones</span>
              <ChevronDown size={18} />
            </Button>
          ) : null}
        </div>
      )}

      {!hasMore && !loadingMore && publicaciones.length > 0 && (
        <div className="paginacion-footer">
          <hr className="my-4" />
          <p className="mb-0">Ya viste todas las publicaciones disponibles</p>
        </div>
      )}
    </div>
  );
};

export default ListarPublicaciones;