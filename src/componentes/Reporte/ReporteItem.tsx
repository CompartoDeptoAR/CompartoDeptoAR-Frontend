import React, { useState } from "react";
import { MiniReporte } from "../../modelos/Reporte";
import { Timestamp } from "firebase/firestore";

interface ReporteItemProps {
  reporte: MiniReporte;
  onVer: (id: string) => void;
  onEliminar: (id: string) => void;
  onIgnorar: (id: string) => void;

  // 🔥 Nuevo callback opcional
  onRevertir?: (id: string) => void;
}

export const ReporteItem: React.FC<ReporteItemProps> = ({
  reporte,
  onVer,
  onEliminar,
  onIgnorar,
  onRevertir
}) => {
  const [expandido, setExpandido] = useState(false);

  const timestampToDate = (ts: any): Date | null => {
    if (!ts || typeof ts !== "object") return null;
    if (typeof ts.seconds !== "number") return null;
    return new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6);
  };

  const formatearFecha = (ts: any): string => {
    const fecha = timestampToDate(ts);
    if (!fecha) return "---";

    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const truncarTexto = (texto: string, maxLength: number = 100) => {
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + "...";
  };


  return (
    <div className={`card mb-3 ${reporte.revisado ? 'border-success' : 'border-warning'}`}>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="card-title mb-0">
                <span
                  className={`badge ${
                    reporte.tipo === "publicacion" ? "bg-primary" : "bg-info"
                  } me-2`}
                >
                  {reporte.tipo === "publicacion"
                    ? "📄 Publicación"
                    : "💬 Mensaje"}
                </span>
                {reporte.revisado && <span className="badge bg-success">✓ Revisado</span>}

                {reporte.revisado && reporte.accionTomada && (
                  <div className="mb-3 p-2 rounded bg-light border">
                    <strong>Acción tomada:</strong>{" "}
                    <span className="badge bg-info text-dark">
                      {reporte.accionTomada.tipo === "eliminado" && <span className="badge bg-success">🗑️ Contenido eliminado</span>}
                      {reporte.accionTomada.tipo === "ignorado" && <span className="badge bg-success">🚫 Reporte ignorado</span>}
                      {reporte.accionTomada.tipo === "revertido" && <span className="badge bg-success">♻️ Acción revertida</span>}
                    </span>

                    {reporte.accionTomada.moderador && (
                      <div className="mt-1">
                        <small className="text-muted">
                          Moderador: {reporte.accionTomada.moderador}
                        </small>
                      </div>
                    )}

                    {reporte.accionTomada.fecha && (
                      <div className="mt-1">
                        <small className="text-muted">
                          Fecha: {formatearFecha(reporte.accionTomada.fecha)}
                        </small>
                      </div>
                    )}
                  </div>
                )}

              </h5>

              <small className="text-muted">
                {formatearFecha(reporte.fechaReporte)}
              </small>
            </div>

            <div className="mb-2">
              <strong className="text-danger">Motivo:</strong>{" "}
              <span className="badge bg-danger-subtle text-danger">
                {reporte.motivo}
              </span>
            </div>

            <div className="mb-3">
              <strong>Descripción:</strong>
              <p className="mb-0 mt-1">
                {expandido
                  ? reporte.descripcion
                  : truncarTexto(reporte.descripcion)}
                {reporte.descripcion.length > 100 && (
                  <button
                    className="btn btn-link btn-sm p-0 ms-2"
                    onClick={() => setExpandido(!expandido)}
                  >
                    {expandido ? "Ver menos" : "Ver más"}
                  </button>
                )}
              </p>
            </div>

            {/* 🔥 Botones dinámicos */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onVer(reporte.id)}
              >
                👁️ Ver detalles
              </button>

              {!reporte.revisado ? (
                <>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onEliminar(reporte.id)}
                  >
                    🗑️ Eliminar contenido
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onIgnorar(reporte.id)}
                  >
                    ✖️ Ignorar
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => onRevertir?.(reporte.id)}
                >
                  🔄 Deshacer acción
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteItem;
