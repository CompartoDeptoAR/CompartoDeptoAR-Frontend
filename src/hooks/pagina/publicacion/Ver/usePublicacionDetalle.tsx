import { useEffect, useState } from "react";
import apiPublicacion from "../../../../api/endpoints/publicaciones";
import apiCalificacion from "../../../../api/endpoints/calificacion";
import type { PublicacionResponce } from "../../../../modelos/Publicacion";
import { Navegar } from "../../../../navigation/navigationService";
import { useToast } from "../../../useToast";
import { useParams } from "react-router-dom";
import apiUsuario from "../../../../api/endpoints/usuario";
import { useLoading } from "../../../../contexts/LoadingContext";

export const usePublicacionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { showError } = useToast();
  const { showLoader, hideLoader } = useLoading();

  const [publicacion, setPublicacion] = useState<PublicacionResponce | null>(null);
  const [promedio, setPromedio] = useState<number>(0);
  const [firstLoad, setFirstLoad] = useState(true); 

  useEffect(() => {
    if (!id) {
      showError("No se encontró la publicación");
      Navegar.volverAtras();
      return;
    }

    cargarTodo();
  }, [id]);

  const cargarTodo = async () => {
    try {
      setFirstLoad(true);
      showLoader();

      let data = await apiPublicacion.publicacion.obtener(id!);

if (!data.usuarioNombre) {
  try {
    const usuario = await apiUsuario.usuario.obtenerPerfilPorId(data.usuarioId!);
    data.usuarioNombre = usuario?.nombreCompleto || "Usuario";
  } catch {
    data.usuarioNombre = "Usuario";
  }
}

  data.habitos = data.habitos ?? {};
  data.preferencias = data.preferencias ?? {};

      setPublicacion(data);

      try {
        const prom = await apiCalificacion.calificacion.obtenerPromedio(id!);
        setPromedio(prom.promedio);
      } catch {
        setPromedio(0);
      }

    } catch (err) {
      console.error("Error cargando publicación:", err);
      setPublicacion(null);
    } finally {
      hideLoader();
      setFirstLoad(false);
    }
  };

  return {
    id,
    publicacion: firstLoad ? {} as any : publicacion,
    promedio,
  };
};
