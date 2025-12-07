import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Reporte } from "../../../modelos/Reporte";

import apiDenuncia from "../../../api/endpoints/denuncia";
import { ContenidoReportado } from "../../../componentes/Reporte/ContenidoReportado";
import { AccionesModeracion } from "../../../componentes/Reporte/AccionesModeracion";

export default function ReporteDetallePage() {
  const { id } = useParams();
  const [reporte, setReporte] = useState<Reporte>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await apiDenuncia.denuncia.obtener(id!);
        setReporte(data);
      } catch (error) {
        console.error("Error cargando reporte:", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!reporte) return <div>Reporte no encontrado</div>;

  return (
    <div className="container mt-3">

      <h3>Reporte #{reporte.id}</h3>

      <h5>Contenido reportado:</h5>
      <ContenidoReportado reporte={reporte} />

      <hr />

      <AccionesModeracion reporte={reporte} />
    </div>
  );
}



