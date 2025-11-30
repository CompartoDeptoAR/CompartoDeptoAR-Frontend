import React from "react";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useMisPublicaciones } from "../../../hooks/pagina/publicacion/listar/useMisPublicaciones";

const MisPublicaciones: React.FC = () => {
  const {
    publicaciones,
    loading,
    error,
    toast,
    hideToast,
    handleEdit,
    handleDelete,
    handleEstado,
    handleCrearNueva,
  } = useMisPublicaciones();

  return (
    <>
      <div className="container mt-4 mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="mb-1">📋 Mis Publicaciones</h2>
            <p className="text-muted mb-0">
              {publicaciones.length === 0
                ? "Aún no tienes publicaciones"
                : `${publicaciones.length} publicación${publicaciones.length !== 1 ? "es" : ""}`}
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleCrearNueva}>
            ➕ Nueva Publicación
          </button>
        </div>

        <ListarPublicaciones
          publicaciones={publicaciones}
          loading={loading}
          error={error}
          emptyMessage="Aún no tienes publicaciones. ¡Crea tu primera publicación!"
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEstado={handleEstado}
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

export default MisPublicaciones;