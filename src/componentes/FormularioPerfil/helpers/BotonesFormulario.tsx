import { Navegar } from "../../../navigation/navigationService";


interface BotonesFormularioProps {
  modo: "view" | "editar" | "verOtro";
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({ modo }) => {


  if (modo === "view") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button type="button" className="btn btn-primary" onClick={() => Navegar.editarPerfil()}>
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
        <button type="button" className="btn btn-secondary" onClick={() => Navegar.volverAtras()}>
          Cancelar
        </button>
      </div>
    );
  }

  if (modo === "verOtro") {
    return (
      <div className="mt-3 d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" onClick={() => Navegar.volverAtras()}>
          Volver
        </button>
      </div>
    );
  }

  return null;
};

export default BotonesFormulario;