import type { Publicacion, PublicacionResponce, PublicacionResumida } from "../../modelos/Publicacion";
import axiosApi from "../config/axios.config";

interface ResultadoPaginado {
  publicaciones: PublicacionResumida[];
  ultId?: string;
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
  publicacion: {
    crearPublicacion: async (data: Partial<PublicacionResponce>): Promise<{ mensaje: string }> => {
      try {
        console.log("🚀 Enviando datos a crear publicación:", data);
        const result = await axiosApi.post<{ mensaje: string }>(`${urlApi}/`, data);
        console.log("✅ Respuesta del servidor:", result.data);
        return result.data;
      } catch (error: any) {
        console.error("❌ Error completo:", error);
        const mensajeError =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Error desconocido al crear publicación";
        throw new Error(mensajeError);
      }
    },

    misPublicaciones: async (usuarioId?: string): Promise<PublicacionResumida[]> => {
      const headers: Record<string, string> = {};

      if (usuarioId) {
        headers["x-user-id"] = usuarioId;
      }

      const res = await axiosApi.get<PublicacionResumida[]>(`${urlApi}/misPublicaciones`, {
        headers,
      });
      return res.data;
    },

    traerPaginadas: async (limit = 10, startAfterId?: string): Promise<ResultadoPaginado> => {
      try {
        const res = await axiosApi.get<ResultadoPaginado>(`${urlApi}/`, {
          params: { limit, startAfterId },
        });
        console.log("📦 Publicaciones paginadas:", res.data);
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

    obtener: async (id: string): Promise<PublicacionResponce> => {
      try {
        const res = await axiosApi.get<PublicacionResponce>(`${urlApi}/${id}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error al obtener la publicación");
      }
    },

    cambiarEstado: async (id: string, nuevoEstado: "activa" | "pausada"): Promise<void> => {
      try {
        await axiosApi.patch(`${urlApi}/${id}`, { estado: nuevoEstado });
      } catch (error: any) {
        throw new Error(error.response?.data?.error || "Error al cambiar el estado de la publicación");
      }
    },
  },
};

export default apiPublicacion;