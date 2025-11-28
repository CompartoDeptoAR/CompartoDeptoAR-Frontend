import type { Rol } from "../../modelos/Roles";
import type { Genero, HabitosUsuario, PreferenciasUsuario } from "../../modelos/Usuario";

export interface LoginRequest {
  idToken: any;
}

export interface LoginResponse {
  token: string;
  rol: Rol[];
  ID: string;
  mail?: string;
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