
import { useReportes } from "../../../hooks/pagina/admin/useReportes";
import ReportesList from "../../../componentes/Reporte/ReporteList";
import { useLoading } from "../../../contexts/LoadingContext";
import { useEffect } from "react";

const ReportesPage = () => {
  const {
    reportes,
    cargando,
    error,
    handleVer,
    refrescar
  } = useReportes();
  const { showLoader, hideLoader } = useLoading();   

   useEffect(() => {
      if (cargando) showLoader();
      else hideLoader();
    }, [cargando]);

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={refrescar}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Reportes recibidos</h2>
        <button 
          className="btn btn-outline-primary btn-sm" 
          onClick={refrescar}
          disabled={cargando}
        >
          🔄 Actualizar
        </button>
      </div>
      <ReportesList 
        reportes={reportes}
        onVer={handleVer}
      />
    </div>
  );
};

export default ReportesPage;