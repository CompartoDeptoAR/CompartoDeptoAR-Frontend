import axiosApi from "../config/axios.config";
import { TokenService } from "../../services/auth/tokenService";

const urlApi = import.meta.env.VITE_URL_MODERACION;

const apiModeracion = {
  listarReportes: async (): Promise<any> => {
    try {
      const usuarioId = TokenService.getUserId();
      if (!usuarioId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.get(`${urlApi}`);

      return res.data;
    } catch (error: any) {
      console.error("Error listando reportes:", error);
      throw error;
    }
  },

  revisarReporte: async (
    idReporte: string,
    accion: "dejado" | "eliminado",
    motivo?: string
  ): Promise<any> => {
    try {
      const usuarioId = TokenService.getUserId();
      if (!usuarioId) throw new Error("Usuario no autenticado");

      const body = { accion, motivo };

      const res = await axiosApi.post(
        `${urlApi}/${idReporte}/revisar`,
        body,
      );

      return res.data;
    } catch (error: any) {
      console.error("Error revisando reporte:", error);
      throw error;
    }
  },

  eliminarPublicacion: async (
    idPublicacion: string,
    motivo?: string
  ): Promise<any> => {
    try {
      const usuarioId = TokenService.getUserId();
      if (!usuarioId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.delete(`${urlApi}/${idPublicacion}`);

      return res.data;
    } catch (error: any) {
      console.error("Error eliminando publicación:", error);
      throw error;
    }
  },

  eliminarMensaje: async (
    idMensaje: string,
    motivo?: string
  ): Promise<any> => {
    try {
      const usuarioId = TokenService.getUserId();
      if (!usuarioId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.delete(`${urlApi}/mensajes/${idMensaje}`);

      return res.data;
    } catch (error: any) {
      console.error("Error eliminando mensaje:", error);
      throw error;
    }
  }
};

export default apiModeracion;
