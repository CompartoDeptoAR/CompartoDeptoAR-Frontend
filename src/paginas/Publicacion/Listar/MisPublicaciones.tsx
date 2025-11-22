import React, { useEffect, useState } from "react";

import type { PublicacionResumida } from "../../../modelos/Publicacion";
import { useToast } from "../../../componentes/ToastNotification/useToast";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import ListarPublicaciones from "../../../componentes/Publicacion/ListarPublicacion/ListarPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { Navigation } from "../../../navigation/navigationService";

const MisPublicaciones: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    setLoading(true);
    setError("");
    try {
      // El backend ya devuelve PublicacionMinDto que coincide con PublicacionResumida
      const data = await apiPublicacion.publicacion.misPublicaciones();
      setPublicaciones(data);
    } catch (err: any) {
      console.error("Error al cargar publicaciones:", err);
      setError(err.message || "Error al cargar tus publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    Navigation.editarPublicacion(id!)
  };

  const handleDelete = async (id: string) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    try {
      await apiPublicacion.publicacion.eliminarPublicacion(id);
      showSuccess("✅ Publicación eliminada exitosamente");
      
      // Eliminar de la lista local sin recargar
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
    } catch (err: any) {
      console.error("Error al eliminar publicación:", err);
      showError(err.message || "❌ Error al eliminar la publicación");
    }
  };

  const handleCrearNueva = () => {
    Navigation.crearPublicacion;
  };

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