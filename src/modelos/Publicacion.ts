import type { HabitosUsuario, PreferenciasUsuario, Usuario } from "./Usuario";

export type EstadoPublicacion = "activa" | "pausada" | "inactiva";

export interface PublicacionResponce {
  [x: string]: any;
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion:string; 
  foto: string[]; 
  reglas?: string[]; 
  preferencias?: PreferenciasUsuario;
  habitos?: HabitosUsuario;
  usuarioId: Usuario["id"];
  nombreUsuario?: string; 
  estado: EstadoPublicacion;
  createdAt: string;
  updatedAt: string;
}

export interface Publicacion {
  titulo: string;
  descripcion: string;
  precio: number;
  provincia: string;
  localidad: string;
  direccion: string;
  ubicacion: string;
  foto: string[]; 
  reglas?: string[];
  preferencias?: PreferenciasUsuario;
  habitos?: HabitosUsuario;
  estado: EstadoPublicacion;
}

export interface PublicacionResumida {
  id: string ;
  titulo: string;
  ubicacion: string;
  precio: number;
  foto?: string;
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

