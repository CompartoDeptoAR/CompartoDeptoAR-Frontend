import { BotonInicio, BotonVolver } from "@/componentes/common/buttons";
import PublicacionDetalleView from "../../../componentes/Publicacion/componentePrincipal.tsx/PublicacionDetalleView";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { usePublicacionDetalle } from "../../../hooks/pagina/publicacion/Ver/usePublicacionDetalle";
import { useToast } from "../../../hooks/useToast";



const VerPublicacion = () => {
  const { toast, hideToast } = useToast();
  const { publicacion } = usePublicacionDetalle();
 

  if (publicacion === null) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Publicación no encontrada</h4>
          <p>La publicación que buscas no existe o ha sido eliminada.</p>
          <BotonVolver/>
          <BotonInicio/>
          
        </div>
      </div>
    );
  }

  return (
    <>
      <PublicacionDetalleView
        publicacion={publicacion}
        usuarioNombre={publicacion.usuarioNombre || "Usuario"}
        usuarioId={publicacion.usuarioId!}
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
