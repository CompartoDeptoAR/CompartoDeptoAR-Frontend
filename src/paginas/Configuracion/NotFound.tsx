import React from "react";
import imagen404 from "../../assets/404.svg"; 

const NotFoundPage: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-4" style={{ minHeight: "80vh" }}>
      <img src={imagen404} alt="404 - Página no encontrada" style={{ maxWidth: "350px" }} />
      <h2 className="mt-4">Oops... Página no encontrada</h2>
      <p className="text-muted text-center">La página que buscás no existe o fue movida.</p>

      <a href="/" className="btn btn-primary mt-3">
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFoundPage;
