import { useState, useEffect } from "react";
import apiPublicacion from "../../services/api/endpoints/publicaciones";
import { Navegar } from "../../navigation/navigationService";
import type { PublicacionResumida } from "../../modelos/Publicacion";
import Swal from "sweetalert2"
import "@/styles/admin/PublicacionesAdminPage.css";

const PublicacionesAdminPage = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    cargarPublicaciones();
  }, []);
 ;

  const confirmarEliminacion = (onConfirmar: () => void) => {
    Swal.fire({
      title: "⚠️ Zona de riesgo",
      text: "Si continúas, esta publicación se eliminará del sistema y no podrá recuperarse.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar definitivamente",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirmar();
      }
    });
  };

  const cargarPublicaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await apiPublicacion.publicacion.traerTodasAdmin();
      setPublicaciones(resultado.publicaciones);
    } catch (err: any) {
      setError(err.message || "Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    
    try {
      setEliminando(id);
      await apiPublicacion.publicacion.eliminarPublicacionHard(id);
      setPublicaciones(prev => prev.filter(pub => pub.id !== id));
      alert("✅ Publicación eliminada correctamente");
    } catch (err: any) {
      alert(`❌ Error al eliminar: ${err.message}`);
    } finally {
      setEliminando(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-3">Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>❌ Error</h5>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={cargarPublicaciones}>
          Reintentar
        </button>
      </div>
    );
  }

  if (publicaciones.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <h5>📭 No hay publicaciones</h5>
        <p className="mb-0">No se encontraron publicaciones en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="publicaciones-admin">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📋 Todas las Publicaciones</h2>
        <span className="badge bg-primary fs-6">
          {publicaciones.length} total
        </span>
      </div>

      <div className="list-group">
        {publicaciones.map((pub) => (
          <div
            key={pub.id}
            className="list-group-item list-group-item-action publicacion-item"
          >
            <div className="d-flex align-items-start gap-3">
              {/* Imagen */}
              <div className="publicacion-imagen">
                {pub.foto ? (
                  <img src={pub.foto} alt={pub.titulo} />
                ) : (
                  <span className="text-muted">🏠</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow-1 publicacion-info">
                <h5>{pub.titulo}</h5>

                <div className="publicacion-meta mb-2">
                  <span>📍 {pub.ubicacion}</span>
                  <span>💰 ${pub.precio.toLocaleString()}/mes</span>
                  <span
                    className={`badge ${
                      pub.estado === "activa"
                        ? "estado-activa"
                        : pub.estado === "pausada"
                        ? "estado-pausada"
                        : "estado-otro"
                    }`}
                  >
                    {pub.estado}
                  </span>
                </div>

                <small className="text-muted">ID: {pub.id}</small>
              </div>

              {/* Acciones */}
              <div className="publicacion-acciones">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => Navegar.verPublicacion(pub.id)}
                >
                  👁️ Ver detalle
                </button>

                <button
                  className="btn btn-outline-danger btn-sm"
                  disabled={eliminando === pub.id}
                  onClick={() =>
                    confirmarEliminacion( () =>
                      handleEliminar(pub.id)
                    )
                  }
                >
                  {eliminando === pub.id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>🗑️ Eliminar</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default PublicacionesAdminPage;