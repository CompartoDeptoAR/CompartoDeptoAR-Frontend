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
  habitos?: HabitosOpciones[];
  preferencias?: PreferenciaOpciones[];
}


export type PreferenciaOpciones =
      |"No me molesta que fumen"
      |"No me molestan las mascotas"
      |"Ok con música fuerte"
      |"Ok con horarios nocturnos"
      |"Ok con visitas frecuentes"
      |"Prefiero alguien ordenado"
      |"Prefiero alguien tranquilo"
      |"Prefiero alguien social";


export type HabitosOpciones =
    |"Fumador"
    |"Tengo mascotas"
    |"Escucho música fuerte"
    |"Me acuesto tarde"
    |"Trabajo desde casa"
    |"Recibo visitas seguido"
    |"Cocino en casa"
    |"Hago ejercicio en casa";

export type Genero = "Masculino" | "Femenino" | "Prefiero no decir";

