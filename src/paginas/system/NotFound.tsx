import React from "react";
import imagen404 from "@/assets/404.svg";
import { BotonInicio } from "@/componentes/common/buttons";
import "@/styles/interno/PageCard.css";
import "@/styles/interno/NotFound.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className="page not-found">
      <div className="page-card text-center">
        <img
          src={imagen404}
          alt="404 - Página no encontrada"
          className="page-image"
        />

        <h1 className="page-title">
          Oops… página no encontrada
        </h1>

        <p className="page-text">
          La página que buscás no existe o fue movida.
        </p>

        <div className="page-actions">
          <BotonInicio />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
