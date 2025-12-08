import React, { useState } from "react";
import { Reporte } from "../../modelos/Reporte";
import apiModeracion from "../../api/endpoints/moderacion";

interface Props {
  reporte: Reporte;
  onChange?: () => void; 
}

export const AccionesModeracion: React.FC<Props> = ({ reporte, onChange }) => {
  const [loading, setLoading] = useState(false);

  const procesar = async (accion: "eliminado" | "dejado", motivo: string) => {
    await apiModeracion.revisarReporte({
      idReporte: reporte.id!,
      accion,
      motivo,
    });
  };

  const handleEliminar = async () => {
    const motivo = prompt("Motivo de eliminación (obligatorio):");

    if (!motivo || motivo.trim() === "") {
      alert("El motivo es obligatorio");
      return;
    }

    if (!confirm("¿Seguro que querés eliminar esta publicación?")) return;

    setLoading(true);

    try {
      await apiModeracion.eliminarPublicacion(reporte.idContenido!, motivo);
      await procesar("eliminado", motivo);

      alert("Publicación eliminada");
      onChange?.();

    } catch (error) {
      console.error(error);
      alert("Error eliminando publicación");

    } finally {
      setLoading(false);
    }
  };

  const handleIgnorar = async () => {
    if (!confirm("¿Ignorar este reporte?")) return;

    setLoading(true);

    try {
      await procesar("dejado", "Ignorado por moderador");
      alert("Reporte ignorado");
      onChange?.();

    } catch (error) {
      console.error(error);
      alert("Error ignorando reporte");
    } finally {
      setLoading(false);
    }
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
            🗑️ Eliminar Publicacion
          </button>

          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={handleIgnorar}
          >
            ✖️ Ignorar Reporte
          </button>

        </div>

      </div>
    </div>
  );
};
