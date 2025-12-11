import axiosApi from "../config/axios.config";
import { TokenService } from "../../services/auth/tokenService";
import { MiniReporte } from "../../modelos/Reporte";

const urlApi = import.meta.env.VITE_URL_MODERACION;

interface RevisarReporte{
  idReporte: string,
  accion: "dejado" | "eliminado",
  motivo: string
}
interface RespuestaRevisarReporte {
  mensaje: string;
}

const apiModeracion = {
  listarReportes: async (): Promise<MiniReporte[]> => {
    try {
      const usuarioId = TokenService.getUserId();
      if (!usuarioId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.get<MiniReporte[]>(`${urlApi}`);

      return res.data;
    } catch (error: any) {
      console.error("Error listando reportes:", error);
      throw error;
    }
  },

  revisarReporte: async ( revisar: RevisarReporte): Promise<RespuestaRevisarReporte> => {
    try {
      const usuarioId = TokenService.getUserId();
      if (!usuarioId) throw new Error("Usuario no autenticado");

      const body = { accion:revisar.accion , motivo:revisar.motivo };

      const res = await axiosApi.post<RespuestaRevisarReporte>(
        `${urlApi}/${revisar.idReporte}/revisar`,
        body,
      );

      return res.data;
    } catch (error: any) {
      console.error("Error revisando reporte:", error);
      throw error;
    }
  },

  eliminarPublicacion: async (idPublicacion: string, motivo: string): Promise<any> => {
    try {
      const res = await axiosApi.post(`${urlApi}/${idPublicacion}`, {
        data: { motivo }
      } as any);

      return res.data;
    } catch (error: any) {
      console.error("Error eliminando publicación:", error);
      throw error;
    }
  },

  eliminarPublicacionDeFormaPermanente: async (id:string, motivo: string):Promise<void>=>{
    try {
      await axiosApi.delete(`${urlApi}/eliminarPublicacionDeFormaPermanente/${id}/${motivo}`);
      
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error al eliminar publicación");
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
