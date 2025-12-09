import { useState, useEffect } from "react";
import apiPublicacion from "./../../api/endpoints/publicaciones";
import apiModeracion from "../../api/endpoints/moderacion";
import { Navegar } from "../../navigation/navigationService";
import type { PublicacionResumida } from "../../modelos/Publicacion";

const PublicacionesAdminPage = () => {
  const [publicaciones, setPublicaciones] = useState<PublicacionResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await apiPublicacion.publicacion.traerPaginadas(100);
      setPublicaciones(resultado.publicaciones);
    } catch (err: any) {
      setError(err.message || "Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string, titulo: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar la publicación "${titulo}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    const motivo = window.prompt(
      "Ingresa el motivo de la eliminación:",
      "Violación de políticas de la plataforma"
    );

    if (!motivo) return;

    try {
      setEliminando(id);
      await apiModeracion.eliminarPublicacion(id, motivo);
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📋 Todas las Publicaciones</h2>
        <span className="badge bg-primary fs-6">{publicaciones.length} total</span>
      </div>

      <div className="list-group">
        {publicaciones.map((pub) => (
          <div
            key={pub.id}
            className="list-group-item list-group-item-action py-4 mb-3 border rounded shadow-sm"
          >
            <div className="d-flex align-items-start gap-3">
              {/* Imagen miniatura */}
              <div
                className="flex-shrink-0"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#e9ecef",
                }}
              >
                {pub.foto ? (
                  <img
                    src={pub.foto}
                    alt={pub.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <span className="text-muted">🏠</span>
                  </div>
                )}
              </div>

              {/* Información de la publicación */}
              <div className="flex-grow-1">
                <h5 className="mb-2">{pub.titulo}</h5>
                <div className="d-flex flex-wrap gap-3 text-muted small mb-2">
                  <span>
                    <i className="bi bi-geo-alt-fill"></i> {pub.ubicacion}
                  </span>
                  <span>
                    <i className="bi bi-cash"></i> ${pub.precio.toLocaleString()}/mes
                  </span>
                  <span>
                    <span
                      className={`badge ${
                        pub.estado === "activa"
                          ? "bg-success"
                          : pub.estado === "pausada"
                          ? "bg-warning"
                          : "bg-secondary"
                      }`}
                    >
                      {pub.estado}
                    </span>
                  </span>
                </div>
                <small className="text-muted">ID: {pub.id}</small>
              </div>

              {/* Botones de acción */}
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => Navegar.verPublicacion(pub.id)}
                  style={{ minWidth: "120px" }}
                >
                  👁️ Ver detalle
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleEliminar(pub.id, pub.titulo)}
                  disabled={eliminando === pub.id}
                  style={{ minWidth: "120px" }}
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