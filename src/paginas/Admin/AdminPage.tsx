import { useState } from "react";
import ReportesPage from "./ReportePage";

const AdminPage = () => {
  const [tab, setTab] = useState("reportes");

  return (
    <div>
      <h1>Panel de administración</h1>

      <nav className="tabs">
        <button onClick={() => setTab("reportes")}>Reportes</button>
        <button onClick={() => setTab("usuarios")}>Usuarios / Roles</button>
      </nav>

      <div className="content">
        {tab === "reportes" && <ReportesPage />}
        {tab === "usuarios" && <UsuariosRolesPage />}
      </div>
    </div>
  );
};

export default AdminPage;




export function ReportesList() {
  return (
    <div className="reportes-list">
      {reportes.map((r) => (
        <ReporteItem key={r.id} reporte={r} />
      ))}
    </div>
  );
}

export function ReporteItem({ reporte }) {
  return (
    <div className="reporte-item">
      <div>
        <strong>{reporte.tipo}</strong> - {reporte.descripcion}
      </div>
      <div>{reporte.fecha}</div>

      <div className="acciones">
        <button>Ver</button>
        <button>Eliminar</button>
        <button>Ignorar</button>
      </div>
    </div>
  );
}

function UsuariosRolesPage() {
  return (
    <div>
      <h2>Gestionar roles</h2>
      <input placeholder="Buscar usuario" />
      {/* tabla con usuarios */}
    </div>
  );
}
