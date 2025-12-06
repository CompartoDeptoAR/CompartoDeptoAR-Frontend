import { Navegar } from "../navigation/navigationService";


interface Props {
  texto?: string;
  className?: string;
}

export function BotonVolver({ texto = "Volver", className = "" }: Props) {
  return (
    <button
      type="button"
      className={`btn btn-outline-secondary ${className}`}
      onClick={() => Navegar.volverAtras()}
    >
      {texto}
    </button>
  );
}
