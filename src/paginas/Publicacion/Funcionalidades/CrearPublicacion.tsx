import FormularioPublicacion from "../../../componentes/Publicacion/componentePrincipal.tsx/FormularioPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import { useToast } from "../../../hooks/useToast";
import { usePublicacionForm } from "../../../hooks/pagina/publicacion/Form/crear/usePublicacionForm";
import { usePublicacionSubmit } from "../../../hooks/pagina/publicacion/Form/usePublicacionSubmit";
import { useNavigationActions } from "../../../hooks/sistema/useNavigationActions";

const CrearPublicacion = () => {
  const {
    formData,
    resetForm,
    handleChange,
    handleProvinciaChange,
    handleLocalidadChange,
    handleFotosChange,
    handlePreferenciasChange,
    handleHabitosChange,
  } = usePublicacionForm();


  const { toast, hideToast, showSuccess, showError, showWarning } = useToast();

 
  const { handleSubmit, loading } = usePublicacionSubmit(
    formData,
    resetForm,
    showSuccess,
    showError,
    showWarning
  );

  const { handleCancel } = useNavigationActions();

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