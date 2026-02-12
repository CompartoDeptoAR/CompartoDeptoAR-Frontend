import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiPublicacion from "@/services/api/endpoints/publicaciones";
import type { PublicacionResponce } from "@/modelos/Publicacion";
import { useLoading } from "@/contexts/LoadingContext";
import { useToast } from "@/hooks/useToast";
import { Navegar } from "@/navigation/navigationService";

export const usePublicacionDetalleAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const { showLoader, hideLoader } = useLoading();
  const { showError } = useToast();

  const [publicacion, setPublicacion] =
    useState<PublicacionResponce | null>(null);

  useEffect(() => {
    if (!id) {
      showError("No se encontró la publicación");
      Navegar.volverAtras();
      return;
    }

    const cargar = async () => {
      try {
        showLoader();

        const data =
          await apiPublicacion.publicacion.obtenerAdmin(id);

        if (!data) {
          setPublicacion(null);
          return;
        }

        data.habitos = data.habitos ?? {};
        data.preferencias = data.preferencias ?? {};

        setPublicacion(data);
      } catch (error) {
        console.error("Error admin detalle:", error);
        setPublicacion(null);
      } finally {
        hideLoader();
      }
    };

    cargar();
  }, [id]);

  return { publicacion };
};
