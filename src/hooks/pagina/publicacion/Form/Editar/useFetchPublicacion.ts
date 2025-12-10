import { useEffect, useState } from "react";
import type { Publicacion, PublicacionResponce } from "../../../../../modelos/Publicacion";
import { useToast } from "../../../../useToast";
import { Navegar } from "../../../../../navigation/navigationService";
import apiPublicacion from "../../../../../api/endpoints/publicaciones";

export const useFetchPublicacion = (
  id: string | undefined,
  setFormData: (data: Publicacion) => void
) => {
  const { showError } = useToast();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        showError("ID de publicación no válido");
        Navegar.misPublicaciones();
        return;
      }

      try {
        const data: PublicacionResponce = await apiPublicacion.publicacion.obtener(id);

        // Parse ubicación
        const parts = data.ubicacion?.split(",").map((s) => s.trim()) ?? [];

        const provincia = parts[parts.length - 1] || "";
        const localidad = parts[parts.length - 2] || "";
        const calle = parts.length > 2 ? parts.slice(0, -2).join(", ") : "";
        const numeral = parts.length > 2 ? parts.slice(0, -2).join(", ") : "";

        setFormData({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          precio: data.precio || 0,
          provincia,
          localidad,
          calle,
          numeral,
          foto: Array.isArray(data.foto) ? data.foto : [],
          reglas: Array.isArray(data.reglas) ? data.reglas : [],
          preferencias: data.preferencias || {},
          habitos: data.habitos || {},
          estado: data.estado,
          reglasTexto: ""
        });
      } catch (e) {
        console.error("Error al cargar publicación:", e);
        showError("No se pudo cargar la publicación");
        setTimeout(() => Navegar.misPublicaciones(), 2000);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  return { loadingData };
};
