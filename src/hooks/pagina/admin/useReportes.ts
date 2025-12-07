
import { useState, useEffect, useCallback } from "react";
import { MiniReporte } from "../../../modelos/Reporte";
import apiModeracion from "../../../api/endpoints/moderacion";
import { Navegar } from "../../../navigation/navigationService";


export const useReportes = () => {
  const [reportes, setReportes] = useState<MiniReporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string>("");


  const cargarReportes = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const data = await apiModeracion.listarReportes();
      setReportes(data);
    } catch (err: any) {
      console.error("Error cargando reportes:", err);
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
    if (reporte) {
      console.log("Ver reporte:", reporte);
      Navegar.verReporte(reporte.id);
    }
  }, []);

  // Eliminar contenido reportado
  const handleEliminar = useCallback(async (id: string) => {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) return;

    const confirmado = window.confirm(
      `¿Estás seguro de eliminar este contenido?\n\nTipo: ${reporte.tipo}\nMotivo: ${reporte.motivo}`
    );

    if (!confirmado) return;

    const motivo = window.prompt("Motivo de la eliminación (opcional):");

    try {
      setCargando(true);
      setError("");

      // Primero eliminar el contenido según el tipo
      if (reporte.tipo === "publicacion") {
        await apiModeracion.eliminarPublicacion(id, motivo || undefined);
      } else if (reporte.tipo === "mensaje") {
        await apiModeracion.eliminarMensaje(id, motivo || undefined);
      }

      // Luego marcar el reporte como revisado con acción "eliminado"
      await apiModeracion.revisarReporte({
        idReporte: id,
        accion: "eliminado",
        motivo: motivo || undefined
      });

      // Actualizar la lista local
      setReportes(prevReportes => 
        prevReportes.map(r => 
          r.id === id ? { ...r, revisado: true } : r
        )
      );

      alert("Contenido eliminado exitosamente");
    } catch (err: any) {
      console.error("Error eliminando contenido:", err);
      setError(err.message || "Error al eliminar el contenido");
      alert(`Error: ${err.message || "No se pudo eliminar el contenido"}`);
    } finally {
      setCargando(false);
    }
  }, [reportes]);

  // Ignorar reporte
  const handleIgnorar = useCallback(async (id: string) => {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) return;

    const confirmado = window.confirm(
      `¿Marcar este reporte como ignorado?\n\nTipo: ${reporte.tipo}\nMotivo: ${reporte.motivo}`
    );

    if (!confirmado) return;

    try {
      setCargando(true);
      setError("");

      // Marcar como revisado con acción "dejado"
      await apiModeracion.revisarReporte({
        idReporte: id,
        accion: "dejado"
      });

      // Actualizar la lista local
      setReportes(prevReportes => 
        prevReportes.map(r => 
          r.id === id ? { ...r, revisado: true } : r
        )
      );

      alert("Reporte marcado como ignorado");
    } catch (err: any) {
      console.error("Error ignorando reporte:", err);
      setError(err.message || "Error al ignorar el reporte");
      alert(`Error: ${err.message || "No se pudo ignorar el reporte"}`);
    } finally {
      setCargando(false);
    }
  }, [reportes]);

  // Refrescar reportes
  const refrescar = useCallback(() => {
    cargarReportes();
  }, [cargarReportes]);

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