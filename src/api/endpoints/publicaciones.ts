import type { Publicacion } from "../../modelos/Publicacion";
import axiosApi from "../config/axios.config";

interface ResultadoPaginado {
  publicaciones: Publicacion[];
  lastId?: string;
}

interface FiltrosBusqueda {
  ubicacion?: string;
  precioMin?: number;
  precioMax?: number;
  preferencias?: string[];
  [key: string]: any;
}

const apiPublicacion = {
    crearPublicacion: async (data: Publicacion):Promise<Publicacion> => {
        try {
            const result = await axiosApi.post<Publicacion>(`${import.meta.env.VITE_URL_PUBLICACION}`, data);
            return result.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Error al crear publicación");
        }
    },
    misPublicaciones: async (): Promise<Publicacion[]> => {
        const res = await axiosApi.get<Publicacion[]>("/api/publicaciones/misPublicaciones");
        return res.data;
    },
    
    traerPaginadas: async (limit = 10, startAfterId?: string): Promise<ResultadoPaginado> => {
    try {
      const res = await axiosApi.get<ResultadoPaginado>("/api/publicaciones", {
        params: { limit, startAfterId },
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al obtener publicaciones");
    }
  },
    actualizarPublicacion: async (idPublicacion: string, data: Partial<string>): Promise<void> => {
        try {
        await axiosApi.put(`/api/publicaciones/actualizar/${idPublicacion}`, data);
        } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error al actualizar la publicación");
        }
    },
    eliminarPublicacion: async (id: string): Promise<void> => {
        try {
        await axiosApi.delete(`/api/publicaciones/eliminar/${id}`);
        } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error al eliminar publicación");
        }
    },
    buscarPublicaciones: async (texto: string): Promise<Publicacion[]> => {
        try {
        const res = await axiosApi.get<Publicacion[]>(`/api/publicaciones/buscar`, {
            params: { texto },
        });
        return res.data;
        } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error al buscar publicaciones");
        }
    },
    buscarConFiltros: async (filtros: FiltrosBusqueda): Promise<Publicacion[]> => {
        try {
        const res = await axiosApi.post<Publicacion[]>("/api/publicaciones/buscarConFiltros", filtros);
        return res.data;
        } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error al filtrar publicaciones");
        }
    },



}

export default apiPublicacion;