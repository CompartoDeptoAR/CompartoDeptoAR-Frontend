import { useState } from "react";
import type { Publicacion, PublicacionFormulario } from "../../../modelos/Publicacion";
import { useToast } from "../../useToast";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import { Navigation } from "../../../navigation/navigationService";


export const usePublicacionSubmit = (formData: PublicacionFormulario) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.titulo?.trim()) return showWarning("El título es obligatorio");
    if (!formData.provincia) return showWarning("Selecciona una provincia");
    if (!formData.localidad) return showWarning("Selecciona una localidad");
    if (!formData.precio || formData.precio <= 0)
      return showWarning("El precio debe ser mayor a 0");
    if (!formData.descripcion?.trim())
      return showWarning("La descripción es obligatoria");
    if (formData.descripcion.length < 20)
      return showWarning("La descripción debe tener al menos 20 caracteres");

    setLoading(true);

    try {
      const ubicacion = formData.direccion?.trim()
        ? `${formData.direccion}, ${formData.localidad}, ${formData.provincia}`
        : `${formData.localidad}, ${formData.provincia}`;

      const publicacionParaEnviar: Partial<Publicacion> = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        ubicacion,
        foto: formData.foto.filter((url) => url.trim().length > 0),
        reglas: formData.reglas.filter((r) => r.trim().length > 0),
        preferencias: formData.preferencias,
        habitos: formData.habitos,
        estado: "activa",
      };

      const response = await apiPublicacion.publicacion.crearPublicacion(publicacionParaEnviar);

      console.log("Publicación creada:", response);
      showSuccess("¡Publicación creada exitosamente!");

      setTimeout(() => Navigation.misPublicaciones(), 1500);
    } catch (error: any) {
      console.error("Error al crear publicación:", error);

      let mensaje = "Error al crear la publicación";

      if (error?.response) {
        const status = error.response.status;
        const backendMsg =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data?.details;

        if (status === 400) mensaje = backendMsg ?? "Datos inválidos";
        else if (status === 401) {
          mensaje = "No autorizado. Inicia sesión";
          setTimeout(() => Navigation.auth(), 2000);
        } else if (status === 413) mensaje = "Datos demasiado grandes";
        else if (status >= 500) mensaje = "Error del servidor";
        else mensaje = backendMsg || `Error ${status}`;
      } else if (error.request) {
        mensaje = "Error de conexión. Verifica tu internet";
      } else mensaje = error.message;

      showError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};
