import React, { useState } from "react";
import "../../../styles/CartaPublicacion.css";
import type {EstadoPublicacion,PublicacionResumida} from "../../../modelos/Publicacion";
import error from "../../../assets/error.png";
import { BotonFavorito } from "@/componentes/common/buttons";
import { isLoggedIn } from "@/helpers/funcion";
import { ModalAccesoRestringido } from "@/componentes/ToastNotification/ModalAccesoRestringido";
import { Navegar } from "@/navigation/navigationService";
import { TokenService } from "@/services/auth/tokenService";

interface CartaPublicacionProps {
  publicacion: PublicacionResumida;
  showActions?: boolean;
  isFavorite?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEstado?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onVerDetalles: (id: string) => void;
}

const CartaPublicacion: React.FC<CartaPublicacionProps> = ({
  publicacion,
  showActions = false,
  isFavorite = false,
  onEdit,
  onDelete,
  onEstado,
  onToggleFavorite,
  onVerDetalles,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const userId = TokenService.getUserId();
  const uid = TokenService.getUid();

 /* 
  console.log("TokenService.getUserId():", userId);
  console.log("TokenService.getUid():", uid);
  console.log("publicacion.usuarioId:", publicacion.usuarioId);
*/


  const esPublicacionPropia =
    TokenService.isAuthenticated() &&
    (
      String(publicacion.usuarioId) === String(userId) ||
      String(publicacion.usuarioId) === String(uid)
    );

  console.log("¿Es publicación propia?", esPublicacionPropia);

  const handleVerDetalle = () => {
    onVerDetalles(publicacion.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(publicacion.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(publicacion.id);
  };

  const handleEstado = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEstado?.(publicacion.id);
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn()) {
      setMostrarModal(true);
      return;
    }

    if (esPublicacionPropia) return;

    onToggleFavorite?.(publicacion.id);
  };

  const getEstadoBadge = (estado: EstadoPublicacion) => {
    const badges = {
      activa: { class: "bg-success", text: "✓ Activa" },
      pausada: { class: "bg-warning text-dark", text: "⏸ Pausada" },
      inactiva: { class: "bg-secondary", text: "⊗ Inactiva" },
    };
    return badges[estado] || badges.activa;
  };

  const imagenUrl = publicacion.foto;

  const estadoBadge = getEstadoBadge(publicacion.estado);

  return (
    <>
      <div
        className="carta-publicacion card h-100 shadow-sm"
        onClick={handleVerDetalle}
      >
        <div className="carta-publicacion__imagen-container position-relative">
          <img
            src={imagenUrl}
            className="card-img-top carta-publicacion__imagen"
            alt={publicacion.titulo}
            onError={(e) => {
              (e.target as HTMLImageElement).src = error;
            }}
          />

          <span className="badge bg-success carta-publicacion__precio">
            ${publicacion.precio.toLocaleString("es-AR")}
          </span>

          {!esPublicacionPropia && (
            <div className="carta-publicacion__favorito">
              <BotonFavorito
                esFavorito={isFavorite}
                size="sm"
                onToggle={handleToggleFavorite}
              />
            </div>
          )}

          <span
            className={`badge ${estadoBadge.class} carta-publicacion__estado`}
          >
            {estadoBadge.text}
          </span>
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title carta-publicacion__titulo">
            {publicacion.titulo}
          </h5>

          {showActions && (
            <div className="mt-auto pt-2 d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary flex-fill"
                onClick={handleEdit}
              >
                ✏️ Editar
              </button>

              <button
                className="btn btn-sm btn-outline-warning flex-fill"
                onClick={handleEstado}
              >
                {publicacion.estado === "activa"
                  ? "⏸ Pausar"
                  : "▶️ Activar"}
              </button>

              <button
                className="btn btn-sm btn-outline-danger flex-fill"
                onClick={handleDelete}
              >
                🗑️ Eliminar
              </button>
            </div>
          )}

          {!showActions && (
            <button
              className="btn btn-primary btn-sm mt-auto"
              onClick={handleVerDetalle}
            >
              Ver detalles →
            </button>
          )}
        </div>
      </div>

      <ModalAccesoRestringido
        visible={mostrarModal}
        onLogin={() => Navegar.auth()}
        onClose={() => setMostrarModal(false)}
      />
    </>
  );
};

export default CartaPublicacion;
