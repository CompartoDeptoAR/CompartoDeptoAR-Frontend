import type { Rol } from "./Roles";
export type Genero = "Masculino" | "Femenino" | "Prefiero no decir";

export interface Usuario{
  id?: string;
  firebaseUid?: string;
  correo: string;
  contraseña: string;
  rol: Rol[];
  fechaCreacion: Date;
  perfil: UsuarioPerfil;

}

export interface UsuarioPerfil {
  nombreCompleto?: string;
  edad?: number;
  genero?: Genero;
  descripcion?: string;
  habitos?: HabitosUsuario;
  preferencias?: PreferenciasUsuario;
  fotoPerfil?: string;
}

export const OPCIONES_HABITOS = [
  'fumador',
  'mascotas',
  'musicaFuerte',
  'horariosNocturno',
  'visitas',
  'orden',
  'tranquilo',
  'social',
  'cocino',
  'ejercicio',
] as const;

export const OPCIONES_PREFERENCIAS = [
  'fumador',
  'mascotas',
  'musicaFuerte',
  'horariosNocturno',
  'visitas',
  'orden',
  'tranquilo',
  'social',
] as const;

export type HabitoKey = typeof OPCIONES_HABITOS[number];
export type PreferenciaKey = typeof OPCIONES_PREFERENCIAS[number];

export const LABELS_HABITOS: Record<HabitoKey, string> = {
  fumador: "Fumador",
  mascotas: "Tengo mascotas",
  musicaFuerte: "Escucho música fuerte",
  horariosNocturno: "Horarios nocturnos",
  visitas: "Recibo visitas frecuentes",
  orden: "Soy ordenado",
  tranquilo: "Tranquilo",
  social: "Social",
  cocino: "Cocino regularmente",
  ejercicio: "Hago ejercicio",
};

export const LABELS_PREFERENCIAS: Record<PreferenciaKey, string> = {
  fumador: "Acepto fumadores",
  mascotas: "Acepto mascotas",
  musicaFuerte: "Acepto música fuerte",
  horariosNocturno: "Acepto horarios nocturnos",
  visitas: "Acepto visitas",
  orden: "Prefiero orden",
  tranquilo: "Prefiero tranquilidad",
  social: "Prefiero ambiente social",
};

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
  [key: string]: boolean | undefined; 
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
  [key: string]: boolean | undefined; 
}