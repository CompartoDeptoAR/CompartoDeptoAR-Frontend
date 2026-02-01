import { Navegar } from "../../../navigation/navigationService";

interface Props {
  texto?: string;
  className?: string;
  idContenido: string;
}

function BotonDenuncia({
  texto = "Denunciar",
  className = "",
  idContenido,
}: Props) {
  return (
    <span
      role="button"
      className={`boton-denuncia-link ${className}`}
      onClick={() => Navegar.denunciaConId(idContenido)}
    >
      {texto}
    </span>
  );
}

export default BotonDenuncia;