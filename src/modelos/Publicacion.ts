import type { HabitosUsuario, PreferenciasUsuario, Usuario } from "./Usuario";

export type EstadoPublicacion = "activa" | "pausada" | "eliminada";

export interface PublicacionResponce {
  id?: string;
  titulo: string;
  descripcion: string;
  ubicacion:string;
  precio: number;
  foto: string[]; 
  reglas?: string[]; 
  preferencias?: PreferenciasUsuario;
  habitos?: HabitosUsuario;
  usuarioId: Usuario["id"];
  usuarioFirebaseUid: Usuario["firebaseUid"]
  usuarioNombre?: string; 
  estado: EstadoPublicacion;
  fecha_eliminado?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Publicacion {
  titulo: string;
  descripcion: string;
  precio: number;
  provincia: string;
  localidad: string;
  calle: string;
  numeral:string;
  foto: string[]; 
  reglas?: string[];
  reglasTexto: string;
  fecha_eliminado?: string;
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



export interface ResultadoPaginado {
  publicaciones: Publicacion[];
  lastId?: string;
}

export interface FiltrosBusqueda {
  ubicacion?: string;
  precioMin?: number;
  precioMax?: number;
  noFumadores?: boolean;
  sinMascotas?: boolean;
  tranquilo?: boolean;
  social?: boolean;
}
