import { BotonVolver, BotonInicio } from "@/componentes/common/buttons";
import error500 from "@/assets/404.svg"; 
import "@/styles/interno/PageCard.css";
import "@/styles/interno/Error500.css";

const Error500 = () => {
  return (
    <div className="page error-500">
      <div className="page-card text-center">
        {error500 && (
          <img
            src={error500}
            alt="Error del servidor"
            className="page-image"
          />
        )}

        <h1 className="page-title">
          💥 Error 500
        </h1>

        <p className="page-text">
          Ocurrió un error inesperado en el servidor.
        </p>

        <p className="page-subtext">
          Por favor, intentá nuevamente más tarde.
        </p>

        <div className="page-actions">
          <BotonVolver />
          <BotonInicio className="btn-danger" />
        </div>
      </div>
    </div>
  );
};

export default Error500;
