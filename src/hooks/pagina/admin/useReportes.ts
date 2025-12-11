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

  


  

  const refrescar = useCallback(cargarReportes, [cargarReportes]);

  return {
    reportes,
    cargando,
    error,
    handleVer,
    refrescar
  };
};
