import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import FormularioPublicacionView from "../../../componentes/Publicacion/FormularioPublicacion/FormularioPublicacionView";
import { useToast } from "../../../hooks/useToast";
import { usePublicacionDetalle } from "../../../hooks/publicacion/Ver/usePublicacionDetalle";
import { useAccionesPublicacion } from "../../../hooks/publicacion/Ver/useAccionesPublicacion";
import { Navegar } from "../../../navigation/navigationService";


const VerPublicacion = () => {
  const { toast, hideToast } = useToast();
  const { publicacion, promedio, fetchPromedio } = usePublicacionDetalle();
  const { handleContactar } = useAccionesPublicacion(publicacion, fetchPromedio);

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
      <FormularioPublicacionView
        publicacion={publicacion}
        nombreUsuario={publicacion.nombreUsuario || "Usuario"}
        usuarioId={publicacion.usuarioId!}
        calificacionPromedio={promedio}
        onContactar={handleContactar}
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
