import { Navegar } from "@/navigation/navigationService";

interface Props {
  texto?: string;
  className?: string;
}

const BotonAuth = ({ texto = "Iniciar sesión", className = "" }: Props) => {
  return (
    <button
      type="button"
      className={`btn btn-primary ${className}`}
      onClick={Navegar.auth}
    >
      {texto}
    </button>
  );
};

export default BotonAuth;
