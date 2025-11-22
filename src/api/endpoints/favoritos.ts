import type { PublicacionResumida } from "../../modelos/Publicacion";
import axiosApi from "../config/axios.config";


const urlApi = import.meta.env.VITE_URL_FABORITO;


const apiFavorito = {
    favorito: {
        // Agregar publicación a favoritos
        agregarFavorito: async (publicacionId: string): Promise<any> => {
            try {
                const response = await axiosApi.post(`${urlApi}/favoritos`, {
                    publicacionId
                });

                return response.data;

            } catch (error: any) {
                console.error('Error al agregar favorito:', error);
                throw error;
            }
        },

        // Eliminar publicación de favoritos
        eliminarFavorito: async (publicacionId: string): Promise<any> => {
            try {
                const response = await axiosApi.delete(`${urlApi}/favoritos/${publicacionId}`);

                return response.data;

            } catch (error: any) {
                console.error('Error al eliminar favorito:', error);
                throw error;
            }
        },

        // Listar todas las publicaciones favoritas del usuario
        listarFavoritos: async (): Promise<PublicacionResumida[]> => {
            try {
                const response = await axiosApi.get<PublicacionResumida[]>(`${urlApi}/favoritos`);

                return response.data;

            } catch (error: any) {
                console.error('Error al listar favoritos:', error);
                throw error;
            }
        },

        // Verificar si una publicación está en favoritos
        esFavorito: async (publicacionId: string): Promise<boolean> => {
            try {
                const favoritos = await apiFavorito.favorito.listarFavoritos();
                return favoritos.some((fav: any) => fav.publicacionId === publicacionId || fav.id === publicacionId);
            } catch (error: any) {
                console.error('Error al verificar favorito:', error);
                return false;
            }
        }
    }
};

export default apiFavorito;