import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioPublicacion from "../../componentes/FormularioPublicacion/FormularioPublicacion";
import { useToast } from "../../componentes/ToastNotification/useToast";
import apiPublicacion from "../../api/endpoints/publicaciones";
import ToastNotification from "../../componentes/ToastNotification/ToastNotification";
import type { Publicacion } from "../../modelos/Publicacion";

const CrearPublicacion = () => {
  const [publicacion, setPublicacion] = useState<Publicacion>({
    titulo: "",
    descripcion: "",
    precio: 0,
    provincia: "",
    localidad: "",
    direccion: "",
    foto: [],
    reglas: [],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    
    if (name === "reglas") {
      const reglasArray = value
        .split("\n")
        .map((regla) => regla.trim())
        .filter((regla) => regla.length > 0);

      setPublicacion((prev) => ({
        ...prev,
        reglas: reglasArray,
      }));
      return;
    }


    setPublicacion((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const handleProvinciaChange = (provincia: string) => {
    setPublicacion((prev) => ({
      ...prev,
      provincia,
      localidad: "",
    }));
  };

  const handleLocalidadChange = (localidad: string) => {
    setPublicacion((prev) => ({
      ...prev,
      localidad,
    }));
  };


  const handleFotosChange = (fotos: string[]) => {
    setPublicacion((prev) => ({
      ...prev,
      foto: fotos,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!publicacion.titulo.trim()) {
      showWarning("El título es obligatorio");
      return;
    }
    if (!publicacion.provincia) {
      showWarning("Selecciona una provincia");
      return;
    }
    if (!publicacion.localidad) {
      showWarning("Selecciona una localidad");
      return;
    }
    if (publicacion.precio <= 0) {
      showWarning("El precio debe ser mayor a 0");
      return;
    }
    if (!publicacion.descripcion.trim()) {
      showWarning("La descripción es obligatoria");
      return;
    }

    setLoading(true);

    try {

      const ubicacionCompleta = publicacion.direccion
        ? `${publicacion.direccion}, ${publicacion.localidad}, ${publicacion.provincia}`
        : `${publicacion.localidad}, ${publicacion.provincia}`;


      const dataParaEnviar = {
        ...publicacion,
        ubicacion: ubicacionCompleta,
        foto: publicacion.foto.filter((url) => url.trim().length > 0),
        reglas: publicacion.reglas || [],
      };

      await apiPublicacion.publicacion.crearPublicacion(dataParaEnviar);

      showSuccess("¡Publicación creada exitosamente!");

      setTimeout(() => navigate("/mis-publicaciones"), 1500);
    } catch (error: any) {
      console.error("Error al crear publicación:", error);

      let errorMessage = "Error al crear la publicación";

      if (error.response) {
        const backendError =
          error.response.data?.error || error.response.data?.message;

        errorMessage = `Error ${error.response.status}: ${backendError}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <FormularioPublicacion
        publicacion={publicacion}
        handleChange={handleChange}
        onProvinciaChange={handleProvinciaChange}
        onLocalidadChange={handleLocalidadChange}
        onFotosChange={handleFotosChange}
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