import { useState, useEffect, useCallback } from "react";
import { MiniReporte } from "../../../modelos/Reporte";
import apiModeracion from "../../../api/endpoints/moderacion";
import { Navegar } from "../../../navigation/navigationService";

export const useReportes = () => {
  const [reportes, setReportes] = useState<MiniReporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarReportes = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const data = await apiModeracion.listarReportes();
      setReportes(data);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar los reportes");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  const handleVer = useCallback((id: string) => {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) return;

    Navegar.verReporte(reporte.id!);
  }, [reportes]);

  const handleEliminar = useCallback(async (id: string) => {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) return;

    if (!window.confirm(`¿Eliminar este contenido?\n\nTipo: ${reporte.tipo}\nMotivo: ${reporte.motivo}?`))
      return;

    const motivo = window.prompt("Motivo de la eliminación (obligatorio):");

    if (!motivo || motivo.trim() === "") {
      alert("El motivo es obligatorio para eliminar");
      return;
    }

    try {
      setCargando(true);
      setError("");

      if (reporte.tipo === "publicacion") {
        await apiModeracion.eliminarPublicacion(reporte.idContenido, motivo);
      } else {
        await apiModeracion.eliminarMensaje(reporte.idContenido, motivo);
      }

      await apiModeracion.revisarReporte({
        idReporte: id,
        accion: "eliminado",
        motivo
      });

      setReportes(prev =>
        prev.map(r =>
          r.id === id ? { ...r, revisado: true } : r
        )
      );

      alert("Contenido eliminado exitosamente");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al eliminar");
      alert("Error eliminando");
    } finally {
      setCargando(false);
    }

  }, [reportes]);

  const handleIgnorar = useCallback(async (id: string) => {
    const confirmado = window.confirm("¿Marcar este reporte como ignorado?");
    if (!confirmado) return;

    try {
      setCargando(true);
      setError("");

      await apiModeracion.revisarReporte({
        idReporte: id,
        accion: "dejado",
        motivo: "Ignorado por moderador" 
      });

      setReportes(prev =>
        prev.map(r =>
          r.id === id ? { ...r, revisado: true } : r
        )
      );

      alert("Reporte ignorado");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al ignorar");
      alert("Error ignorando");
    } finally {
      setCargando(false);
    }

  }, [reportes]);

  const refrescar = useCallback(cargarReportes, [cargarReportes]);

  return {
    reportes,
    cargando,
    error,
    handleVer,
    handleEliminar,
    handleIgnorar,
    refrescar
  };
};
