import type { Genero, HabitosUsuario, PreferenciasUsuario } from "../modelos/Usuario";
import axiosApi from "./_api";


export const getUserRol = () => localStorage.getItem("rol");
export const isLoggedIn = () => !!localStorage.getItem("token");


const apiAuth ={
    auth:{
        registrar: async (
            nombreCompleto: string, 
            correo: string, 
            constraseña: string, 
            edad: number, 
            genero?: Genero,
            descripcion?: string,
            habitos?:HabitosUsuario,
            preferencia?:PreferenciasUsuario) => {
            try {
            const payload: any = { nombreCompleto, correo, constraseña, edad };
            if (genero) payload.genero = genero;
            if (descripcion) payload.descripcion = descripcion;
            if (habitos) payload.habitos= habitos;
            if (preferencia) payload.preferencia = preferencia;

            console.log(payload);
            const result = await axiosApi.post<{ token: string; rol: string }>(
                `${import.meta.env.VITE_URL_USER}/registrar`,
                payload
            );

            if (result.status === 201) return result.data;
            throw new Error("No se pudo registrar el usuario");
            } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message || "Error al registrarse");
            }
            throw new Error("Error de conexión");
            }
        },
        login: async (correo: string, contraseña: string) => {
            try {
            const result = await axiosApi.post<{ token: string, rol: string }>(
                import.meta.env.URL_AUTH + "/login",
                { correo, contraseña }
            );

            if (result.status === 200) return result.data;
            throw new Error("Error al iniciar sesión");
            } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message || "Credenciales inválidas");
            }
            throw new Error("Error de conexión");
            }
        },
       // logout: 
    }
}

export default apiAuth;