import React from "react";
import { Reporte } from "../../modelos/Reporte";
import { Link } from "react-router-dom";
import { Navegar } from "../../navigation/navigationService";
import { Button } from "react-bootstrap";

interface Props {
  reporte: Reporte;
}

export const ContenidoReportado: React.FC<Props> = ({ reporte }) => {
  const { tipo, motivo, descripcion, idContenido, fechaReporte } = reporte;

  const fecha =
    fechaReporte && (fechaReporte.seconds || fechaReporte)
      ? new Date((fechaReporte.seconds ?? fechaReporte) * 1000).toLocaleString("es-AR")
      : "Sin fecha";

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">

        <h5 className="card-title mb-2">
          Detalles del reporte
        </h5>

        <p><strong>Tipo:</strong> {tipo}</p>

        <p><strong>Motivo:</strong> {motivo}</p>

        <p><strong>Descripción:</strong> {descripcion}</p>

        <p><strong>Fecha:</strong> {fecha}</p>

        <hr />

        <h6>Contenido reportado</h6>

        <p className="mb-2">
          <strong>ID contenido:</strong> {idContenido}
        </p>

        {tipo === "publicacion" && (
          <Button
            onClick={()=>Navegar.verPublicacion(idContenido)}
            className="btn btn-sm btn-outline-primary"
          >
            Ver publicación
          </Button>
        )}

        {tipo === "mensaje" && (
          <Link
            to={`/mensajes/${idContenido}`}
            className="btn btn-sm btn-outline-primary"
          >
            Ver mensaje
          </Link>
        )}
      </div>
    </div>
  );
};
