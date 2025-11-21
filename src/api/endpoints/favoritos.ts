
const apiFavorito = {
    favorito: {
        // Agregar publicación a favoritos
        agregarFavorito: async (publicacionId: string): Promise<any> => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/favoritos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ publicacionId })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al agregar favorito');
                }

                return data;

            } catch (error: any) {
                console.error('Error al agregar favorito:', error);
                throw error;
            }
        },

        // Eliminar publicación de favoritos
        eliminarFavorito: async (publicacionId: string): Promise<any> => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/favoritos/${publicacionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al eliminar favorito');
                }

                return data;

            } catch (error: any) {
                console.error('Error al eliminar favorito:', error);
                throw error;
            }
        },

        // Listar todas las publicaciones favoritas del usuario
        listarFavoritos: async (): Promise<any> => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/favoritos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al obtener favoritos');
                }

                return data.favoritos;

            } catch (error: any) {
                console.error('Error al listar favoritos:', error);
                throw error;
            }
        }
    }
}

export default apiFavorito;
