import type { Rol } from "./Roles";


export interface Usuario{
  id?: string;
  correo: string;
  contraseña: string;
  rol: Rol;
  fechaCreacion: Date;
  perfil: UsuarioPerfil;
}

export interface UsuarioPerfil {
  nombreCompleto: string;
  edad: number;
  genero?: Genero;
  descripcion?: string;
  habitos?: HabitosUsuario;
  preferencias?: PreferenciasUsuario;
}


export const opcionesHabitos = [
        "Fumador",
        "Tengo mascotas",
        "Escucho música fuerte",
        "Me acuesto tarde",
        "Trabajo desde casa",
        "Recibo visitas seguido",
        "Cocino en casa",
        "Hago ejercicio en casa",
    ];

export const opcionesPreferencias = [
        "No me molesta que fumen",
        "No me molestan las mascotas",
        "Ok con música fuerte",
        "Ok con horarios nocturnos",
        "Ok con visitas frecuentes",
        "Prefiero alguien ordenado",
        "Prefiero alguien tranquilo",
        "Prefiero alguien social",
    ];

export type Genero = "Masculino" | "Femenino" | "Prefiero no decir";

export interface HabitosUsuario {
  fumador?: boolean;
  mascotas?: boolean;
  musicaFuerte?: boolean;
  horariosNocturno?: boolean;
  visitas?: boolean;
  orden?: boolean;
  tranquilo?:boolean;
  social?:boolean;
  cocino?: boolean;
  ejercicio?: boolean;
}

export interface PreferenciasUsuario {
  fumador?: boolean;
  mascotas?: boolean;
  musicaFuerte?: boolean;
  horariosNocturno?: boolean;
  visitas?: boolean;
  orden?: boolean;
  tranquilo?:boolean;
  social?:boolean;
}