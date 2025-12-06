import { useEffect, useState } from "react";
import apiModeracion from "../../api/endpoints/moderacion";
import { ReporteItem } from "./AdminPage";

const ReportesPage=()=> {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const data = await apiModeracion.listarReportes();
      setReportes(data.reportes);
    } catch {
      // manejar error
    }
  }

  return (
    <div>
      <h2>Reportes pendientes</h2>

      {reportes.map((r) => (
        <ReporteItem key={r.id} reporte={r} onReload={cargar} />
      ))}
    </div>
  );
}

export default ReportesPage;