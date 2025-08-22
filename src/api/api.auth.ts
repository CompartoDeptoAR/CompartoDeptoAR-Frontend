import { handleApiError } from "../helpers/handleApiError";
import type { Genero, HabitosOpciones, PreferenciaOpciones, } from "../modelos/Usuario";
import axiosApi from "./_api";


export const getUserRol = () => localStorage.getItem("rol");
export const isLoggedIn = () => !!localStorage.getItem("token");


const apiAuth ={
    auth:{
        registrar: async (
            nombreCompleto: string, 
            correo: string, 
            contraseña: string, 
            edad: number, 
            genero?: Genero,
            descripcion?: string,
            habitos?:HabitosOpciones[],
            preferencia?:PreferenciaOpciones[]) => {
            try {
            const datos: any = { nombreCompleto, correo, contraseña, edad };
            if (genero) datos.genero = genero;
            if (descripcion) datos.descripcion = descripcion;
            if (habitos) datos.habitos= habitos;
            if (preferencia) datos.preferencia = preferencia;

            console.log(datos);
            const result = await axiosApi.post<{ token: string; rol: string }>(
                import.meta.env.VITE_URL_USER,
                datos
            );

            if (result.status === 201) return result.data;
            handleApiError(result.status, "No se pudo registrar el usuario");
            } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message || "Error al registrarse");
            }
            throw new Error("Error de conexión");
            }
        },
        login: async (correo: string, contrasena: string) => {
            try {
            const result = await axiosApi.post<{ token: string, rol: string }>(
                import.meta.env.VITE_URL_AUTH + "/login",
                { correo, contrasena }
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