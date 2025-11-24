import { useEffect, useState } from "react";
import apiPublicacion from "../../../api/endpoints/publicaciones";
import apiCalificacion from "../../../api/endpoints/calificacion";
import type { PublicacionResponce } from "../../../modelos/Publicacion";
import { Navegar } from "../../../navigation/navigationService";
import { useToast } from "../../useToast";
import { useParams } from "react-router-dom";
import { useGlobalLoader } from "../../sistema/useGlobalLoader";

export const usePublicacionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useToast();
  const { showLoader, hideLoader } = useGlobalLoader();

  const [publicacion, setPublicacion] = useState<PublicacionResponce | null>(null);
  const [promedio, setPromedio] = useState<number>(0);

  useEffect(() => {
    if (!id) {
      showError("No se encontró la publicación");
      Navegar.volverAtras();
      return;
    }

    fetchPublicacion();
    fetchPromedio();
  }, [id]);

  const fetchPublicacion = async () => {
    try {
      showLoader();
      const data = await apiPublicacion.publicacion.obtener(id!);
      setPublicacion(data);
    } catch (err) {
      console.error("Error cargando publicación:", err);
      showError("No se pudo cargar la publicación");
      setTimeout(() => Navegar.home(), 2000);
    } finally {
      hideLoader();
    }
  };

  const fetchPromedio = async () => {
    try {
      if (!id) return;
      const prom = await apiCalificacion.calificacion.obtenerPromedio(id);
      setPromedio(prom);
    } catch (err) {
      console.error("Error cargando promedio:", err);
      setPromedio(0);
    }
  };

  return {
    id,
    publicacion,
    promedio,
    fetchPromedio,
  };
};
