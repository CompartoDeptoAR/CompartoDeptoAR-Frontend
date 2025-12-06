import { useState } from "react";
import ReportesPage from "./Reporte/ReportePage";
import UsuariosRolesPage from "./Usuario/UsuariosRolesPage";

const AdminPage = () => {
  const [tab, setTab] = useState("reportes");
  
  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-5 fw-bold">🛡️ Panel de administración</h1>
          <p className="text-muted">Gestiona reportes, usuarios y roles</p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${tab === "reportes" ? "active" : ""}`}
            onClick={() => setTab("reportes")}
          >
            📋 Reportes
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${tab === "usuarios" ? "active" : ""}`}
            onClick={() => setTab("usuarios")}
          >
            👥 Usuarios / Roles
          </button>
        </li>
      </ul>

      <div className="content">
        {tab === "reportes" && <ReportesPage />}
        {tab === "usuarios" && <UsuariosRolesPage />}
      </div>
    </div>
  );
};

export default AdminPage;