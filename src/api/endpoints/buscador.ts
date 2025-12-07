import axiosApi from "../config/axios.config";
import { handleApiError } from "../../helpers/handleApiError";
import { PublicacionResumida } from "../../modelos/Publicacion";

const rutaEndpoint = import.meta.env.VITE_URL_PUBLICACIONES;


export interface FiltrosBusqueda {
  texto?: string;
  categoria?: string;
  usuarioId?: string;
  orden?: string;
  [key: string]: any;
}

const apiBuscador = {

  /** ============================
   *  GET: Buscar por texto simple
   *  /buscar?texto=xxx
   *  ============================ */
  buscar: async (texto: string): Promise<PublicacionResumida[]> => {

    if (!rutaEndpoint)
      throw new Error("Error de configuración: falta VITE_URL_PUBLICACIONES");

    if (!texto)
      throw new Error("Debe ingresar texto para buscar");

    try {
      const respuesta = await axiosApi.get<PublicacionResumida[]>(
        `${rutaEndpoint}/buscar`,
        {
          params: { texto },
        }
      );

      if (respuesta.status === 200) {
        return respuesta.data || [];
      }

      return handleApiError(
        respuesta.status,
        "Respuesta inesperada del servidor al buscar publicaciones"
      );
      
    } catch (error: any) {

      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          throw new Error(`No se encontraron publicaciones relacionadas a "${texto}"`);
        }

        throw new Error(error.response.data?.mensaje || "Error del servidor");
      }

      throw new Error("Error de conexión, el servidor podría no estar disponible.");
    }
  },



  /** ============================
   *  POST: Buscar con filtros
   *  /buscarConFiltros
   *  ============================ */
  buscarConFiltros: async (filtros: FiltrosBusqueda): Promise<PublicacionResumida[]> => {

    if (!rutaEndpoint)
      throw new Error("Error de configuración: falta VITE_URL_PUBLICACIONES");

    try {
      const respuesta = await axiosApi.post<PublicacionResumida[]>(
        `${rutaEndpoint}/buscarConFiltros`,
        filtros
      );

      if (respuesta.status === 200) {
        return respuesta.data || [];
      }

      return handleApiError(
        respuesta.status,
        "Respuesta inesperada del servidor al buscar con filtros"
      );

    } catch (error: any) {

      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          throw new Error("No se encontraron publicaciones con los filtros aplicados");
        }

        throw new Error(error.response.data?.mensaje || "Error del servidor");
      }

      throw new Error("Error de conexión, el servidor podría no estar disponible.");
    }
  }

};

export default apiBuscador;
