import construccion from "@/assets/en-construccion.png";
import { BotonInicio } from "@/componentes/common/buttons";
import "@/styles/interno/PageCard.css";
import "@/styles/interno/EnConstruccion.css";

const EnConstruccion = () => {
  return (
    <div className="page construccion">
      <div className="page-card text-center">
        <img src={construccion} className="page-image" />
        <h1 className="page-title">🚧 En construcción</h1>

        <p className="page-text">
          Esta sección todavía está en desarrollo.
        </p>

        <p className="page-subtext">
          Estamos trabajando para traértela lo antes posible 💪
        </p>

        <div className="page-actions">
          <BotonInicio />
        </div>
      </div>
    </div>

      );
};

export default EnConstruccion;
