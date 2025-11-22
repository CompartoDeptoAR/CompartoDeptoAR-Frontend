import type { Publicacion, PublicacionResponce, PublicacionResumida,  } from "../../modelos/Publicacion";
import axiosApi from "../config/axios.config";

interface ResultadoPaginado {
  publicaciones: PublicacionResumida[];
  lastId?: string;
}

interface FiltrosBusqueda {
  ubicacion?: string;
  precioMin?: number;
  precioMax?: number;
  preferencias?: string[];
  [key: string]: any;
}
const urlApi = import.meta.env.VITE_URL_PUBLICACION;

const apiPublicacion = {
  
    publicacion:{

        crearPublicacion: async (data: Partial<Publicacion>):Promise<Publicacion> => {
        try {
            const result = await axiosApi.post<Publicacion>(`${urlApi}/`, data);
            return result.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Error al crear publicación");
        }
        },
        misPublicaciones: async (): Promise<PublicacionResumida[]> => {
            const res = await axiosApi.get<PublicacionResumida[]>(`${urlApi}/misPublicaciones`);
            return res.data;
        },
        
        traerPaginadas: async (limit = 10, startAfterId?: string): Promise<ResultadoPaginado> => {
          try {
            const res = await axiosApi.get<ResultadoPaginado>(`${urlApi}/`, {
              params: { limit, startAfterId },
            });
            return res.data;
          } catch (error: any) {
            throw new Error(error.response?.data?.error || "Error al obtener publicaciones");
          }
      },
        actualizarPublicacion: async (idPublicacion: string, data: Partial<Publicacion>): Promise<void> => {
            try {
              await axiosApi.put(`${urlApi}/actualizar/${idPublicacion}`, data);
            } catch (error: any) {
              throw new Error(error.response?.data?.error || "Error al actualizar la publicación");
            }
        },
        eliminarPublicacion: async (id: string): Promise<void> => {
            try {
              await axiosApi.delete(`${urlApi}/eliminar/${id}`);
            } catch (error: any) {
              throw new Error(error.response?.data?.error || "Error al eliminar publicación");
            }
        },
        buscarConFiltros: async (filtros: FiltrosBusqueda): Promise<Publicacion[]> => {
            try {
              const res = await axiosApi.post<Publicacion[]>(`${urlApi}/buscarConFiltros`, filtros);
              return res.data;
            } catch (error: any) {
              throw new Error(error.response?.data?.error || "Error al filtrar publicaciones");
            }
        },
        obtener: async (id:string): Promise<PublicacionResponce>=>{
          try {
            const res = await axiosApi.get<PublicacionResponce>(`${urlApi}/${id}`);
            return res.data;
          } catch (error:any) {
            throw new Error(error.response?.data?.error || "Error al obtener la publicacion");
          }
        }
    }
}

export default apiPublicacion;