import FormularioPublicacion from "../../../componentes/Publicacion/FormularioPublicacion/FormularioPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useToast } from "../../../hooks/useToast";
import { usePublicacionForm } from "../../../hooks/publicacion/Form/crear/usePublicacionForm";
import { usePublicacionSubmit } from "../../../hooks/publicacion/Form/usePublicacionSubmit";
import { useNavigationActions } from "../../../hooks/sistema/useNavigationActions";

const CrearPublicacion = () => {
  const {
    formData,
    handleChange,
    handleProvinciaChange,
    handleLocalidadChange,
    handleFotosChange,
    handlePreferenciasChange,
    handleHabitosChange,

  } = usePublicacionForm();

  const { handleSubmit, loading } = usePublicacionSubmit(formData);

  const { handleCancel } = useNavigationActions();

  const { toast, hideToast } = useToast();

  return (
    <>
      <FormularioPublicacion
        publicacion={formData}
        handleChange={handleChange}
        onProvinciaChange={handleProvinciaChange}
        onLocalidadChange={handleLocalidadChange}
        onFotosChange={handleFotosChange}
        onPreferenciasChange={handlePreferenciasChange}
        onHabitosChange={handleHabitosChange}

        handleSubmit={handleSubmit}
        modo="crear"
        loading={loading}
        onCancel={handleCancel}
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

export default CrearPublicacion;
