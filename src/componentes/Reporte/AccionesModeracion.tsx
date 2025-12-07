import React, { useState } from "react";

import { Reporte } from "../../modelos/Reporte";
import apiModeracion from "../../api/endpoints/moderacion";

interface Props {
  reporte: Reporte;
  onChange?: () => void; 
}

export const AccionesModeracion: React.FC<Props> = ({ reporte, onChange }) => {
  const [loading, setLoading] = useState(false);

  const procesar = async (accion: "eliminado" | "dejado", motivo?: string) => {
    setLoading(true);
    try {
      await apiModeracion.revisarReporte({
        idReporte: reporte.id!,
        accion,
        motivo,
      });

      alert(`Reporte marcado como ${accion}`);

      onChange?.(); 
    } catch (error) {
      alert("Error procesando acción");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    const motivo = prompt("Motivo de eliminación (opcional):") || undefined;
    procesar("eliminado", motivo);
  };

  const handleIgnorar = () => {
    procesar("dejado");
  };

  return (
    <div className="card shadow-sm mb-5">
      <div className="card-body">

        <h5 className="card-title mb-3">
          Acciones de moderación
        </h5>

        <div className="d-flex gap-2">

          <button
            className="btn btn-danger"
            disabled={loading}
            onClick={handleEliminar}
          >
            🗑️ Eliminar contenido
          </button>

          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={handleIgnorar}
          >
            ✖️ Ignorar
          </button>

        </div>

      </div>
    </div>
  );
};
