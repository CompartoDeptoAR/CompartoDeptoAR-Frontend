import { useNavigate } from "react-router-dom";

interface BotonesFormularioProps {
  modo: "view" | "editar" | "verOtro";
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({ modo }) => {
  const navigate = useNavigate();

  if (modo === "view") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button type="button" className="btn btn-primary" onClick={() => navigate("/editar-perfil")}>
          Editar Perfil
        </button>
      </div>
    );
  }

  if (modo === "editar") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button type="submit" className="btn btn-success">
          Guardar Cambios
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/mi-perfil")}>
          Cancelar
        </button>
      </div>
    );
  }

  if (modo === "verOtro") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return null;
};

export default BotonesFormulario;