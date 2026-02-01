import restricted from "@/assets/restricted.svg";
import { BotonVolver, BotonAuth } from "@/componentes/common/buttons";
import "@/styles/interno/PageCard.css";
import "@/styles/interno/RestrictedAccess.css"

const RestrictedAccess = () => (
  <div className="page restricted">
    <div className="page-card text-center">
      <img src={restricted} className="page-image" />
      <h1 className="page-title">Necesitás iniciar sesión</h1>
      <p className="page-text">
        Esta acción está disponible solo para usuarios registrados.
      </p>

      <div className="page-actions">
        <BotonAuth />
        <BotonVolver />
      </div>
    </div>
  </div>

);

export default RestrictedAccess;
