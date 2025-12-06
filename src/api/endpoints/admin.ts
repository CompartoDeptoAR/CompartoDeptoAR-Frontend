import axiosApi from "../config/axios.config";
import { TokenService } from "../../services/auth/tokenService";

const urlApi = import.meta.env.VITE_URL_ADMIN;

const apiAdmin = {
  asignarRol: async (usuarioId: string, rol: string): Promise<any> => {
    try {
      const adminId = TokenService.getUserId();
      if (!adminId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.post(
        `${urlApi}/asignar-rol`,
        { usuarioId, rol },
        { headers: { "x-user-id": adminId } }
      );

      return res.data;
    } catch (error: any) {
      console.error("Error asignando rol:", error);
      throw error;
    }
  },

  sacarRol: async (usuarioId: string, rol: string): Promise<any> => {
    try {
      const adminId = TokenService.getUserId();
      if (!adminId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.post(
        `${urlApi}/sacar-rol`,
        { usuarioId, rol },
        { headers: { "x-user-id": adminId } }
      );

      return res.data;
    } catch (error: any) {
      console.error("Error quitando rol:", error);
      throw error;
    }
  }
};

export default apiAdmin;
