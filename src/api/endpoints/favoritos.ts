import type { PublicacionResumida } from "../../modelos/Publicacion";
import axiosApi from "../config/axios.config";
import { TokenService } from "../../services/auth/tokenService";

interface ListaFavoritoRes {
    mensaje: string,
    publicaciones: PublicacionResumida[],
}

const urlApi = import.meta.env.VITE_URL_FAVORITO;

const apiFavorito = {
    favorito: {
        agregarFavorito: async (publicacionId: string): Promise<any> => {
            try {
                const usuarioId = TokenService.getUserId();
                if (!usuarioId) {
                    throw new Error("Usuario no autenticado");
                }

                const response = await axiosApi.post(`${urlApi}`, {
                    publicacionId
                }, {
                    headers: {
                        'x-user-id': usuarioId
                    }
                });
                return response.data;
            } catch (error: any) {
                console.error('Error al agregar favorito:', error);
                throw error;
            }
        },
        eliminarFavorito: async (publicacionId: string): Promise<any> => {
            try {
                const usuarioId = TokenService.getUserId();
                if (!usuarioId) {
                    throw new Error("Usuario no autenticado");
                }

                const response = await axiosApi.delete(`${urlApi}/${publicacionId}`, {
                    headers: {
                        'x-user-id': usuarioId
                    }
                });

                return response.data;
            } catch (error: any) {
                console.error('Error al eliminar favorito:', error);
                throw error;
            }
        },
        listarFavoritos: async (): Promise<ListaFavoritoRes> => {
            try {
                const usuarioId = TokenService.getUserId();
                if (!usuarioId) {
                    throw new Error("Usuario no autenticado");
                }

                const response = await axiosApi.get<ListaFavoritoRes>(`${urlApi}`, {
                    headers: {
                        'x-user-id': usuarioId
                    }
                });
                return response.data;
            } catch (error: any) {
                console.error('Error al listar favoritos:', error);
                throw error;
            }
        },

        esFavorito: async (publicacionId: string): Promise<boolean> => {
            try {
                const usuarioId = TokenService.getUserId();
                if (!usuarioId) return false;

                const favoritos = (await apiFavorito.favorito.listarFavoritos()).publicaciones;
                return favoritos.some((fav: any) => fav.id === publicacionId);
            } catch (error: any) {
                console.error('Error al verificar favorito:', error);
                return false;
            }
        }
    }
};

export default apiFavorito;