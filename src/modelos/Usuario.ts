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
  genero?: string;
  descripcion?: string;
  preferencias?: PreferenciasUsuario;
}

export interface PreferenciasUsuario {
  opciones:PreferenciaOpciones[];
}
export type PreferenciaOpciones =
  | "Fumador"
  | "No Fumador"
  | "Mascotas"
  | "Sin Mascotas"
  | "Horarios flexibles";

export type Genero = "Masculino" | "Femenino" | "Prefiero no decir";

