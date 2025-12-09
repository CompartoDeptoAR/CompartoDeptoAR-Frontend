import axiosApi from "../config/axios.config";
import { TokenService } from "../../services/auth/tokenService";
import { Usuario } from "../../modelos/Usuario";

const urlApi = import.meta.env.VITE_URL_ADMIN;
const urlUsuarios= import.meta.env.VITE_URL_USER;

const apiAdmin = {

  listarUsuarios: async (): Promise<Usuario[]> => {
    try {
      const adminId = TokenService.getUserId();
      if (!adminId) throw new Error("Usuario no autenticado");

      interface RespuestaUsuarios {
        total: number;
        usuarios: Usuario[];
      }

      const res = await axiosApi.get<RespuestaUsuarios>(`${urlUsuarios}/usuarios`);
      return res.data.usuarios;
    } catch (error: any) {
      console.error("Error listando usuarios:", error);
      throw new Error(error.response?.data?.error || "Error al listar usuarios");
    }
  },

  asignarRol: async (usuarioId: string, rol: string): Promise<any> => {
    try {
      const adminId = TokenService.getUserId();
      if (!adminId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.post(`${urlUsuarios}/asignar-rol`, {
        usuarioId,
        rol
      });

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

      const res = await axiosApi.post(`${urlUsuarios}/sacar-rol`, {
        usuarioId,
        rol
      });

      return res.data;
    } catch (error: any) {
      console.error("Error quitando rol:", error);
      throw error;
    }
  },
   eliminarUsuario: async (usuarioId: string): Promise<any> => {
    try {
      const adminId = TokenService.getUserId();
      if (!adminId) throw new Error("Usuario no autenticado");

      const res = await axiosApi.delete(`${urlUsuarios}/${usuarioId}`);
      return res.data;
    } catch (error: any) {
      console.error("Error eliminando usuario:", error);
      throw new Error(error.response?.data?.error || "Error al eliminar usuario");
    }
  }
};


export default apiAdmin;
