import { useParams } from "react-router-dom";
import FormularioPublicacion from "../../../componentes/Publicacion/FormularioPublicacion/FormularioPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";

import { useToast } from "../../../hooks/useToast";
import { usePublicacionForm } from "../../../hooks/publicacion/Form/crear/usePublicacionForm";
import { useFetchPublicacion } from "../../../hooks/publicacion/Form/Editar/useFetchPublicacion";
import { useEditarPublicacionSubmit } from "../../../hooks/publicacion/Form/Editar/useEditarPublicacionSubmit";
import { useNavigationActions } from "../../../hooks/sistema/useNavigationActions";


const EditarPublicacion = () => {
  const { id } = useParams<{ id: string }>();
  const { toast, hideToast } = useToast();

  const {
    formData,
    setFormData,
    handleChange,
    handleProvinciaChange,
    handleLocalidadChange,
    handleFotosChange,
    handlePreferenciasChange,
    handleHabitosChange,
  } = usePublicacionForm();

  const { loadingData } = useFetchPublicacion(id, setFormData);

  const { handleSubmit, loading } = useEditarPublicacionSubmit(id!, formData);

  const { handleCancel } = useNavigationActions();

  if (loadingData) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted">Cargando publicación...</p>
      </div>
    );
  }

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
        modo="editar"
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

export default EditarPublicacion;
