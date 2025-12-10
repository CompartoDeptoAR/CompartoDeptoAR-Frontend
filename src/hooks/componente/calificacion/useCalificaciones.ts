import { useState, useCallback } from "react";
import apiCalificacion, { CalificacionCrear } from "../../../api/endpoints/calificacion";
import { Calificacion } from "../../../modelos/Calificacion";



interface ObtenerPorUsuarioResp {
  promedio: number;
  calificaciones: Calificacion[];
  mensaje?: string;
}

export const useCalificaciones = () => {
  const [promedio, setPromedio] = useState<number>(0);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPorUsuario = useCallback(async (idUsuario: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: ObtenerPorUsuarioResp =
        await apiCalificacion.calificacion.obtenerPorUsuario(idUsuario);

      setPromedio(res.promedio ?? 0);
      setCalificaciones(res.calificaciones ?? []);

      return res;
    } catch (err: any) {
      setError(err.message ?? "Error inesperado");
      return { promedio: 0, calificaciones: [] };
    } finally {
      setLoading(false);
    }
  }, []);

 const crearCalificacion = useCallback(
  async (data: CalificacionCrear) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCalificacion.calificacion.crear(data);

      // Actualizo promedio
      if (res && typeof res.promedio === "number") {
        setPromedio(res.promedio);
      }

      // refresco calificaciones (usa el idCalificado)
      await fetchPorUsuario(data.idCalificado);

      return res;
    } catch (err: any) {
      setError(err.message ?? "Error inesperado");
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [fetchPorUsuario]
);


  return {
    promedio,
    calificaciones,
    loading,
    error,
    fetchPorUsuario,
    crearCalificacion,
  };
};
