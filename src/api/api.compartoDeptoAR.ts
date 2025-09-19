import type { UsuarioPerfil } from "../modelos/Usuario";
import axiosApi from "./_api";


const api = {
    usuario: {
      
        perfil: async(usuarioId: string):Promise<UsuarioPerfil>=>{
            const result= await axiosApi.get<UsuarioPerfil>(
                import.meta.env.VITE_URL_USER + usuarioId
            )
            if (result.status === 200) return result.data;
            return undefined as unknown as UsuarioPerfil;
           
        }
    
    }
}

export default api;