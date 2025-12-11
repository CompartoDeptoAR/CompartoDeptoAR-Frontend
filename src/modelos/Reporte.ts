import { Timestamp } from "firebase/firestore";

export interface Reporte {
  id?: string;
  tipo: "publicacion" | "mensaje";
  idContenido: string;
  motivo: string;
  descripcion:string;
  reportanteId?: string;
  fechaReporte: Timestamp;
  revisado?: boolean;
  accionTomada?: "dejado" | "eliminado" | null;
  adminId?: string | null;
  motivoEliminacion?: string | null;  
}



export interface AccionTomada {
  tipo: "eliminado" | "ignorado" | "revertido";
  moderador: string;
  fecha: Timestamp;
}

export interface MiniReporte {
  id: string;
  motivo: string;
  descripcion: string;
  tipo: "publicacion" | "mensaje";
  revisado: boolean;
  fechaReporte: Timestamp;

  // NUEVO 🔥
  accionTomada?: AccionTomada;
}

