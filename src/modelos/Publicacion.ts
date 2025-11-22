import type { HabitosUsuario, PreferenciasUsuario } from "./Usuario";

export type EstadoPublicacion = "activa" | "pausada" | "inactiva";

export interface Publicacion {
  id?: string;
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion?: string;
  foto: string[];
  preferencias?: PreferenciasUsuario; 
  habitos?: HabitosUsuario;
  reglas?: string[];
  usuarioId?: string;
  estado?: EstadoPublicacion;
  createdAt?: string;
  updatedAt?: string;
}
export interface PublicacionResumida {
  id: string ;
  titulo: string;
  ubicacion: string;
  precio: number;
  foto?: string[];
  estado:EstadoPublicacion;
}

export interface PublicacionResponce extends Publicacion {
  nombreUsuario?: string;
  calificacionPromedio?: number;
}

export interface ResultadoPaginado {
  publicaciones: Publicacion[];
  lastId?: string;
}

export interface FiltrosBusqueda {
  ubicacion?: string;
  precioMin?: number;
  precioMax?: number;
  preferencias?: string[];
  [key: string]: any;
}

export interface PublicacionFormulario {
  titulo: string;
  descripcion: string;
  precio: number;
  provincia: string;
  localidad: string;
  direccion: string;
  foto: string[];
  reglas: string[];
  preferencias: PreferenciasUsuario;
  habitos: HabitosUsuario;
}