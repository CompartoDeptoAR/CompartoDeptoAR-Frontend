export interface Calificacion {
  id?: string;
  idCalificador: string;
  idCalificado: string | number;
  puntuacion: number;
  comentario?: string;
  fecha: Date;
  nombreCalificador?: string;
}
