import { useState } from "react";
import type { Publicacion, PublicacionResponce } from "../../../../modelos/Publicacion";
import { useToast } from "../../../useToast";
import apiPublicacion from "../../../../api/endpoints/publicaciones";
import { Navegar } from "../../../../navigation/navigationService";



export const usePublicacionSubmit = (formData: Publicacion) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


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

      const ubicacion = formData.direccion?.trim() 
        ? `${formData.direccion}, ${formData.localidad}, ${formData.provincia}` 
        : `${formData.localidad}, ${formData.provincia}`;

      const reglasArray = formData.reglasTexto
        ?.split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0) || [];

    
      const fotosFinales = Array.isArray(formData.foto) && formData.foto.length > 0
        ? formData.foto.filter((url) => url.trim().length > 0)
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
        ubicacion: ubicacion,
      };

      console.log("📤 Enviando publicación:", publicacionParaEnviar);

      const response = await apiPublicacion.publicacion.crearPublicacion(publicacionParaEnviar);
      
      console.log("✅ Publicación creada:", response);
      
      showSuccess("¡Publicación creada exitosamente!");
      
    
      setTimeout(() => {
        Navegar.misPublicaciones();
      },0);

    } catch (error: any) {
      console.error("❌ Error al crear publicación:", error);
      
      let mensaje = "Error al crear la publicación";

      if (error?.response) {
        const status = error.response.status;
        const backendMsg = 
          error.response.data?.error || 
          error.response.data?.message || 
          error.response.data?.details;

        if (status === 400) {
          mensaje = backendMsg ?? "Datos inválidos";
        } else if (status === 401) {
          mensaje = "No autorizado. Inicia sesión";
          setTimeout(() => Navegar.auth(), 2000);
        } else if (status === 413) {
          mensaje = "Datos demasiado grandes (las imágenes son muy pesadas)";
        } else if (status >= 500) {
          mensaje = "Error del servidor. Intenta de nuevo";
        } else {
          mensaje = backendMsg || `Error ${status}`;
        }
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
