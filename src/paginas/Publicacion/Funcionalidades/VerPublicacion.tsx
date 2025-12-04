import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import PublicacionDetalleView from "../../../componentes/Publicacion/componentePrincipal.tsx/PublicacionDetalleView";

import { useToast } from "../../../hooks/useToast";
import { usePublicacionDetalle } from "../../../hooks/pagina/publicacion/Ver/usePublicacionDetalle";
import { Navegar } from "../../../navigation/navigationService";
import { TokenService } from "../../../services/auth/tokenService";

const VerPublicacion = () => {
  const { toast, hideToast } = useToast();
  const { publicacion } = usePublicacionDetalle();

  const usuarioIdActual = TokenService.getAuthData()?.ID || "";

  if (!publicacion) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Publicación no encontrada</h4>
          <p>La publicación que buscas no existe o ha sido eliminada.</p>
          <button className="btn btn-primary" onClick={() => Navegar.home()}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PublicacionDetalleView
        publicacion={publicacion}
        usuarioIdActual={usuarioIdActual}
      />

      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default VerPublicacion;
