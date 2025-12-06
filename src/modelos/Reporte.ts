export interface Reporte {
  id: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  estado: "PENDIENTE" | "RESUELTO" | "ELIMINADO";
  usuarioId: string;
  publicacionId?: string;  // si reportan una publicación
}

export interface ListaReportesRes {
  reportes: Reporte[];
  total: number;
  page: number;
  pageSize: number;
}
