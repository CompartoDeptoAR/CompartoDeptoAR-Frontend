import { useState } from "react";
import type { Publicacion, PublicacionResponce } from "../../../../modelos/Publicacion";
import { useToast } from "../../../useToast";
import apiPublicacion from "../../../../api/endpoints/publicaciones";
import apiUsuario from "../../../../api/endpoints/usuario";
import { Navegar } from "../../../../navigation/navigationService";

export const usePublicacionSubmit = (formData: Publicacion, resetForm: () => void) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validacion
    if (!formData.titulo?.trim()) return showWarning("El título es obligatorio");
    if (!formData.provincia) return showWarning("Selecciona una provincia");
    if (!formData.localidad) return showWarning("Selecciona una localidad");
    if (!formData.calle) return showWarning("Falta la calle");
    if (!formData.numeral) return showWarning("Falta el numeral");
    if (!formData.precio || formData.precio <= 0) return showWarning("El precio debe ser mayor a 0");
    if (!formData.descripcion?.trim()) return showWarning("La descripción es obligatoria");
    if (formData.descripcion.length < 20) return showWarning("La descripción debe tener al menos 20 caracteres");

    setLoading(true);

    try {
      const ubicacion = `${formData.calle} ${formData.numeral}, ${formData.localidad}, ${formData.provincia}`;

      const reglasArray = formData.reglasTexto
        ?.split("\n")
        .map(r => r.trim())
        .filter(r => r.length > 0) || [];

      const fotosFinales = Array.isArray(formData.foto)
        ? formData.foto.filter(url => url.trim().length > 0)
        : [];

      const publicacionParaEnviar: Partial<PublicacionResponce> = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        precio: formData.precio,
        foto: fotosFinales,
        reglas: reglasArray,
        preferencias: formData.preferencias ?? {},
        habitos: formData.habitos ?? {},
        estado: "activa",
        ubicacion,
      };

      console.log("📤 Enviando publicación:", publicacionParaEnviar);

      // 🔥 GUARDAR HÁBITOS Y PREFERENCIAS EN EL PERFIL
      try {
        await apiUsuario.usuario.editarPerfil({
          habitos: formData.habitos ?? {},
          preferencias: formData.preferencias ?? {},
        });
        console.log("✅ Hábitos y preferencias guardados en el perfil");
      } catch (perfilError) {
        console.warn("⚠️ No se pudieron guardar hábitos en el perfil:", perfilError);
        // Continuamos aunque falle el guardado del perfil
      }

      // 🔥 CREAR LA PUBLICACIÓN
      const response = await apiPublicacion.publicacion.crearPublicacion(publicacionParaEnviar);

      console.log("✅ Publicación creada:", response);

      showSuccess(response.mensaje || "¡Publicación creada exitosamente!");
      resetForm();
      setTimeout(() => Navegar.misPublicaciones(), 1000);

    } catch (error: any) {
      console.error("❌ Error al crear publicación:", error);

      let mensaje = "Error al crear la publicación";

      if (error?.response) {
        const status = error.response.status;
        const backendMsg = error.response.data?.error || error.response.data?.message;
        if (status === 400) mensaje = backendMsg || "Datos inválidos";
        else if (status === 401) {
          mensaje = "No autorizado. Inicia sesión";
          setTimeout(() => Navegar.auth(), 2000);
        }
        else if (status >= 500) mensaje = "Error del servidor. Intenta de nuevo";
        else mensaje = backendMsg || `Error ${status}`;
      } else if (error.request) {
        mensaje = "Error de conexión. Verifica tu internet";
      } else {
        mensaje = error.message || "Error desconocido";
      }

      showError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};