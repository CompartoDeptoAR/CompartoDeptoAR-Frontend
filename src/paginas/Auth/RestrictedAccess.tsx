import React from "react";
import { Navegar } from "../../navigation/navigationService";
import restricted from "../../assets/restricted.png"

const RestrictedAccess: React.FC = () => 
    <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5">

      <img 
        src={restricted} 
        alt="Restricted Access"
        className="img-fluid mb-4"
      />

      <h2 className="fw-bold">Necesitas una cuenta</h2>
      <p className="text-muted mb-4">
        Debes iniciar sesión o registrarte para acceder a esta sección.
      </p>

      <div className="d-flex gap-3">
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
  

export default RestrictedAccess;
