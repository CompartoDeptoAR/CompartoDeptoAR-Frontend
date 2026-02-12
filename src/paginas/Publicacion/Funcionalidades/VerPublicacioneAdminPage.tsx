import { BotonInicio, BotonVolver } from "@/componentes/common/buttons";
import PublicacionDetalleView from "../../../componentes/Publicacion/componentePrincipal.tsx/PublicacionDetalleView";
import { usePublicacionDetalleAdmin } from "../../../hooks/pagina/publicacion/Ver/usePublicacionDetalleAdmin";
import { useToast } from "../../../hooks/useToast";
import SwalNotification from "@/componentes/ToastNotification/SwalNotification";

const VerPublicacionAdminPage = () => {
    const { toast, hideToast } = useToast();
    const { publicacion  } = usePublicacionDetalleAdmin();

    if (publicacion === null) {
    return (
        <div className="container mt-5">
        <div className="alert alert-danger text-center">
            <h4>Publicación no encontrada</h4>
            <p>No existe o fue eliminada definitivamente</p>
            <div className="d-flex justify-content-center gap-2 mt-3">
            <BotonVolver />
            <BotonInicio />
            </div>
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

        <SwalNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        />
    </>
    );
};

export default VerPublicacionAdminPage;
