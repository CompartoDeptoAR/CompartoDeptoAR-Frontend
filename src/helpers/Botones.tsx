import { Navegar } from "../navigation/navigationService";


interface Props {
  texto?: string;
  className?: string;
}
interface PropsDenunciaConId extends Props {
  idContenido: string;
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

export function BotonDenunciaConId({ 
  texto = "Denunciar", 
  className = "",
  idContenido,
}: PropsDenunciaConId) {
  return (
    <span
      className={`boton-denuncia-link ${className}`}
      onClick={() => Navegar.denunciaConId(idContenido)}
    >
      {texto}
    </span>
  );
}