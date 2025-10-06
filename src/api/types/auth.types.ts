import type { Genero, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  rol: string;
  id: string;
}

export interface RegisterRequest {
    nombreCompleto: string;
    correo: string;
    contraseña: string;
    edad: number;
    genero?: Genero;
    descripcion?: string;
    habitos?: HabitosUsuario;
    preferencias?: PreferenciasUsuario;
}

export interface RegisterResponse{
    mensaje: string;
}