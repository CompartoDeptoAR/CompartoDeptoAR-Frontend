import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormularioPublicacion from "../../../componentes/Publicacion/FormularioPublicacion/FormularioPublicacion";
import ToastNotification from "../../../componentes/ToastNotification/ToastNotification";
import type { PublicacionFormulario, PublicacionResponce } from "../../../modelos/Publicacion";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import { useToast } from "../../../componentes/ToastNotification/useToast";
import { Navigation } from "../../../navigation/navigationService";




const EditarPublicacion = () => {
  const { id } = useParams<{ id: string }>();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

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
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchPublicacion = async () => {
      if (!id) {
        showError("ID de publicación no válido");
        Navigation.misPublicaciones;
        return;
      }

      try {
        const data: PublicacionResponce = await apiPublicacion.publicacion.obtener(id);

        // Descomponer ubicación: "Dirección, Localidad, Provincia"
        const ubicacionParts = data.ubicacion?.split(",").map((s) => s.trim()) || [];

        const provincia = ubicacionParts.at(-1) || "";
        const localidad = ubicacionParts.at(-2) || "";
        const direccion = ubicacionParts.length > 2 ? ubicacionParts.slice(0, -2).join(", ") : "";

        setFormData({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          precio: data.precio || 0,
          provincia,
          localidad,
          direccion,
          foto: Array.isArray(data.foto) ? data.foto : [],
          reglas: Array.isArray(data.reglas) ? data.reglas : [],
          preferencias: data.preferencias || {},
          habitos: data.habitos || {},
        });
      } catch (error: any) {
        console.error("Error al cargar publicación:", error);
        showError("No se pudo cargar la publicación");
        setTimeout(() => Navigation.misPublicaciones, 2000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPublicacion();
  }, []);

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

    // Validaciones
    if (!formData.titulo.trim()) {
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
    if (formData.precio <= 0) {
      showWarning("El precio debe ser mayor a 0");
      return;
    }
    if (!formData.descripcion.trim()) {
      showWarning("La descripción es obligatoria");
      return;
    }
    if (formData.descripcion.length < 20) {
      showWarning("La descripción debe tener al menos 20 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Construir ubicación completa
      const ubicacionCompleta = formData.direccion?.trim()
        ? `${formData.direccion}, ${formData.localidad}, ${formData.provincia}`
        : `${formData.localidad}, ${formData.provincia}`;

      const dataParaEnviar = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        ubicacion: ubicacionCompleta,
        foto: formData.foto.filter((url) => url.trim().length > 0),
        reglas: formData.reglas.filter((regla) => regla.trim().length > 0),
        preferencias: formData.preferencias,
        habitos: formData.habitos,
      };

      console.log("📤 Actualizando publicación:", dataParaEnviar);

      await apiPublicacion.publicacion.actualizarPublicacion(id!, dataParaEnviar);

      showSuccess("¡Publicación actualizada exitosamente!");

      setTimeout(() => {
        Navigation.verPublicacion(id!);
      }, 1500);
    } catch (error: any) {
      console.error("❌ Error al editar publicación:", error);

      let errorMessage = "Error al actualizar la publicación";
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
          errorMessage = "No autorizado. Verifica tu sesión";
        } else if (status === 403) {
          errorMessage = "No tienes permiso para editar esta publicación";
        } else if (status === 404) {
          errorMessage = "Publicación no encontrada";
        } else if (status >= 500) {
          errorMessage = "Error del servidor. Intenta nuevamente más tarde";
        } else {
          errorMessage = backendError || `Error ${status}`;
        }
      } else if (error.request) {
        errorMessage = "Error de conexión. Verifica tu internet";
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

  if (loadingData) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
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