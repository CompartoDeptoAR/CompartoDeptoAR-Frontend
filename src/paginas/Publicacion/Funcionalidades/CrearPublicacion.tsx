import { useState } from "react";
import FormularioPublicacion from "../../../componentes/Publicacion/FormularioPublicacion/FormularioPublicacion";
import { useToast } from "../../../componentes/ToastNotification/useToast";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import type { Publicacion, PublicacionFormulario } from "../../../modelos/Publicacion";
import { Navigation } from "../../../navigation/navigationService";



const CrearPublicacion = () => {
  const [formData, setFormData] = useState<PublicacionFormulario>({
    titulo: "",
    descripcion: "",
    precio: 0,
    provincia: "",
    localidad: "",
    direccion: "",
    foto: [],
    reglas: [],
    preferencias: {},
    habitos: {},
  });

  const [loading, setLoading] = useState(false);
  
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

      setFormData((prev) => ({
        ...prev,
        reglas: reglasArray,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" ? Number(value) : value,
    }));
  };

  const handleProvinciaChange = (provincia: string) => {
    setFormData((prev) => ({
      ...prev,
      provincia,
      localidad: "",
    }));
  };

  const handleLocalidadChange = (localidad: string) => {
    setFormData((prev) => ({
      ...prev,
      localidad,
    }));
  };

  const handleFotosChange = (fotos: string[]) => {
    setFormData((prev) => ({
      ...prev,
      foto: fotos,
    }));
  };

  const handlePreferenciasChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferencias: {
        ...prev.preferencias,
        [key]: value,
      },
    }));
  };

  const handleHabitosChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      habitos: {
        ...prev.habitos,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.titulo?.trim()) {
      showWarning("El título es obligatorio");
      return;
    }

    if (!formData.provincia) {
      showWarning("Selecciona una provincia");
      return;
    }

    if (!formData.localidad) {
      showWarning("Selecciona una localidad");
      return;
    }

    if (!formData.precio || formData.precio <= 0) {
      showWarning("El precio debe ser mayor a 0");
      return;
    }

    if (!formData.descripcion?.trim()) {
      showWarning("La descripción es obligatoria");
      return;
    }

    if (formData.descripcion.length < 20) {
      showWarning("La descripción debe tener al menos 20 caracteres");
      return;
    }

    setLoading(true);

    try {

      const ubicacionCompleta = formData.direccion?.trim()
        ? `${formData.direccion}, ${formData.localidad}, ${formData.provincia}`
        : `${formData.localidad}, ${formData.provincia}`;

      // Preparar datos para el backend
      const publicacionParaEnviar: Partial<Publicacion> = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        ubicacion: ubicacionCompleta,
        foto: Array.isArray(formData.foto)
          ? formData.foto.filter((url) => url.trim().length > 0)
          : [],
        reglas: Array.isArray(formData.reglas)
          ? formData.reglas.filter((regla) => regla.trim().length > 0)
          : [],
        preferencias: formData.preferencias,
        habitos: formData.habitos,
        estado: "activa",
      };

      console.log("Datos a enviar:", publicacionParaEnviar);

      const response = await apiPublicacion.publicacion.crearPublicacion(publicacionParaEnviar);

      console.log("Publicación creada:", response);

      showSuccess("¡Publicación creada exitosamente!");

      setTimeout(() => {
        Navigation.misPublicaciones;
      }, 1500);
    } catch (error: any) {
      console.error("Error al crear publicación:", error);

      let errorMessage = "Error al crear la publicación";

      if (error.response) {
        const status = error.response.status;
        const backendError =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data?.details;

        if (status === 400) {
          errorMessage = `Datos inválidos: ${
            backendError || "Revisa los campos del formulario"
          }`;
        } else if (status === 401) {
          errorMessage = "No autorizado. Por favor inicia sesión nuevamente";
          setTimeout(() => Navigation.auth, 2000);
        } else if (status === 413) {
          errorMessage =
            "Los datos son demasiado grandes. Reduce el número de fotos o la descripción";
        } else if (status >= 500) {
          errorMessage = "Error del servidor. Intenta nuevamente más tarde";
        } else {
          errorMessage = backendError || `Error ${status}`;
        }
      } else if (error.request) {
        errorMessage =
          "Error de conexión. Verifica tu internet e intenta nuevamente";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Navigation.volverAtras;
  };

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