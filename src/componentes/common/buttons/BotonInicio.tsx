import { Navegar } from "@/navigation/navigationService";

interface Props {
  texto?: string;
  className?: string;
}

function BotonInicio({
  texto = "Volver al inicio",
  className = "",
}: Props) {
  return (
    <button
      type="button"
      className={`btn btn-primary ${className}`}
      onClick={Navegar.home}
    >
      {texto}
    </button>
  );
}

export default BotonInicio;