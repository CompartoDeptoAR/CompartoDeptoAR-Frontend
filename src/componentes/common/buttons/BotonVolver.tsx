import { Navegar } from "../../../navigation/navigationService";


interface Props {
  texto?: string;
  className?: string;
}

function BotonVolver({ texto = "Volver", className = "" }: Props) {
  return (
    <button
      type="button"
      className={`btn btn-outline-secondary ${className}`}
      onClick={Navegar.volverAtras()}
    >
      {texto}
    </button>
  );
}

export default BotonVolver;