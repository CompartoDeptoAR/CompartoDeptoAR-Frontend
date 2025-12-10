import React, { useState } from "react";
import { MiniReporte } from "../../modelos/Reporte";
import ReporteItem from "./ReporteItem";


interface ReporteListProps{
    reportes:MiniReporte[],
    onVer:(id:string)=>void;
    onEliminar:(id:string)=>void;
    onIgnorar:(id:string)=>void;
}

const ReportesList:React.FC<ReporteListProps> = ({ reportes, onVer, onEliminar, onIgnorar }) => {
  const [filtro, setFiltro] = useState("todos");
  
  const reportesFiltrados = reportes.filter(r => {
    if (filtro === "todos") return true;
    if (filtro === "pendientes") return !r.revisado;
    if (filtro === "revisados") return r.revisado;
    if (filtro === "publicaciones") return r.tipo === "publicacion";
    if (filtro === "mensajes") return r.tipo === "mensaje";
    return true;
  });

  return (
    <div>
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button 
            className={`btn btn-sm ${filtro === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({reportes.length})
          </button>
          <button 
            className={`btn btn-sm ${filtro === 'pendientes' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setFiltro('pendientes')}
          >
            Pendientes ({reportes.filter(r => !r.revisado).length})
          </button>
          <button 
            className={`btn btn-sm ${filtro === 'revisados' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFiltro('revisados')}
          >
            Revisados ({reportes.filter(r => r.revisado).length})
          </button>
        </div>
        <div className="btn-group ms-2" role="group">
          <button 
            className={`btn btn-sm ${filtro === 'publicaciones' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFiltro('publicaciones')}
          >
            📄 Publicaciones
          </button>
          <button 
            className={`btn btn-sm ${filtro === 'mensajes' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => setFiltro('mensajes')}
          >
            💬 Mensajes
          </button>
        </div>
      </div>

      {reportesFiltrados.length === 0 ? (
        <div className="alert alert-info">
          No hay reportes en esta categoría.
        </div>
      ) : (
        reportesFiltrados.map((r) => (
          <ReporteItem 
            key={r.id} 
            reporte={r}
            onVer={onVer}
            onEliminar={onEliminar}
            onIgnorar={onIgnorar}
          />
        ))
      )}
    </div>
  );
};

export default ReportesList;