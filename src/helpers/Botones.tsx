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

export function BotonDenunciaLink({ texto = "Denunciar", className = "" }: Props) {
  return (
    <span
      className={`boton-denuncia-link ${className}`}
      onClick={() => Navegar.denuncia()}
    >
      {texto}
    </span>
  );
}