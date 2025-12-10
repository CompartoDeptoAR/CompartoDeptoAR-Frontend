import { useState } from "react";
import { useToast } from "../../../../useToast";
import apiPublicacion from "../../../../../api/endpoints/publicaciones";
import { Navegar } from "../../../../../navigation/navigationService";
import { Publicacion } from "../../../../../modelos/Publicacion";


export const useEditarPublicacionSubmit = (
  id: string,
  formData: Publicacion
) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

 
    if (!formData.titulo.trim()) return showWarning("El título es obligatorio");
    if (!formData.provincia) return showWarning("Selecciona una provincia");
    if (!formData.localidad) return showWarning("Selecciona una localidad");
    if (!formData.calle) return showWarning("Falte la calle");
    if (!formData.numeral) return showWarning("Falte el numeral");
    if (formData.precio <= 0) return showWarning("El precio debe ser mayor a 0");
    if (!formData.descripcion.trim())
      return showWarning("La descripción es obligatoria");
    if (formData.descripcion.length < 20)
      return showWarning("La descripción debe tener al menos 20 caracteres");

    setLoading(true);

    try {
      const ubicacion = `${formData.calle} ${formData.numeral}, ${formData.localidad}, ${formData.provincia}`

      const dataParaEnviar = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        ubicacion,
        foto: formData.foto.filter((url) => url.trim().length > 0),
        reglas: formData.reglas!.filter((r) => r.trim().length > 0),
        preferencias: formData.preferencias,
        habitos: formData.habitos,
      };

      await apiPublicacion.publicacion.actualizarPublicacion(id, dataParaEnviar);

      showSuccess("¡Publicación actualizada exitosamente!");

      setTimeout(() => Navegar.verPublicacion(id), 1500);
    } catch (error: any) {
      let msg = "Error al actualizar la publicación";

      if (error?.response) {
        const status = error.response.status;
        const backendMsg =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data?.details;

        if (status === 400) msg = backendMsg ?? "Datos inválidos";
        else if (status === 401) msg = "No autorizado";
        else if (status === 403) msg = "No tienes permiso";
        else if (status === 404) msg = "Publicación no encontrada";
        else if (status >= 500) msg = "Error del servidor";
        else msg = backendMsg || `Error ${status}`;
      } else if (error.request) msg = "Sin conexión";
      else msg = error.message;

      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};
