import { Navegar } from "@/navigation/navigationService";

interface Props {
  texto?: string;
  className?: string;
  disabled?: boolean;
}

function BotonVolver({
  texto = "Volver",
  className = "",
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      className={`btn btn-outline-secondary ${className}`}
      onClick={Navegar.volverAtras()}
      disabled={disabled}
    >
      {texto}
    </button>
  );
}

export default BotonVolver;
