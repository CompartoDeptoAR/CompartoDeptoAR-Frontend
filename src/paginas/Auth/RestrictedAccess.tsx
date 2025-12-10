import React from "react";
import { Navegar } from "../../navigation/navigationService";
import restricted from "../../assets/restricted.svg";

const RestrictedAccess: React.FC = () => (
  <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5"
       style={{ minHeight: "80vh" }}>

    <img 
      src={restricted} 
      alt="Restricted Access"
      className="img-fluid mb-4"
      style={{
        width: "100%",
        maxWidth: "450px",   
        height: "auto",
        objectFit: "contain",
        padding: "0 1rem"
      }}
    />

    <h2 className="fw-bold">Necesitas una cuenta</h2>

    <p className="text-muted mb-4 px-3" 
       style={{ maxWidth: "420px" }}>
      Debes iniciar sesión o registrarte para acceder a esta sección.
    </p>

    <div className="d-flex flex-wrap gap-3 justify-content-center">
      <button 
        className="btn btn-primary px-4"
        onClick={() => Navegar.auth()}
      >
        Iniciar sesión
      </button>

      <button 
        className="btn btn-outline-secondary px-4"
        onClick={() => Navegar.volverAtras()}
      >
        Volver atrás
      </button>
    </div>
  </div>
);

export default RestrictedAccess;
