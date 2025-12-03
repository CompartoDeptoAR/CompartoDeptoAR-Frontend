import { Timestamp } from "firebase/firestore";

export interface Mensaje {
  id?: string;
  contenido: string;
  idRemitente: string;
  idDestinatario: string;
  idPublicacion: string;
  fechaEnvio: Timestamp;
  leido: boolean;
  participantes: string[]; 
}

export interface Conversacion {
  idPublicacion: string;
  tituloPublicacion: string;
  idOtraPersona: string;
  nombreOtraPersona: string;
  fotoOtraPersona?: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: Date;
  noLeidos: number;
  esUltimoMensajePropio: boolean;
}

export interface MensajeUI {
  id: string;
  contenido: string;
  esPropio: boolean;
  fechaEnvio: Date;
  leido: boolean;
}

export interface ConversacionUI extends Conversacion {
  
}