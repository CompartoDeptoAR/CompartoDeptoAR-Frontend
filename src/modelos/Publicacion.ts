
import type { HabitosUsuario, PreferenciasUsuario, Usuario } from "./Usuario";

export type EstadoPublicacion = "activa" | "pausada" | "eliminada";

export interface PublicacionResponce {
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

export interface PublicacionResumida {
  id: string;
  titulo: string;
  precio: number;
  foto: string | null;
  estado: EstadoPublicacion;
  createdAt: string;
}

export interface Publicacion {
  titulo: string;
  descripcion: string;
  precio: number;
  provincia: string;
  localidad: string;
  direccion: string;
  foto: string[]; // enviar como array
  reglas?: string[]; // opcional
  preferencias?: PreferenciasUsuario;
  habitos?: HabitosUsuario;
}

export interface UpdatePublicacion {
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  foto?: string[];
  reglas?: string[];
  preferencias?: PreferenciasUsuario;
}