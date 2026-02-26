export interface DocumentoTarea {
  nombre: string;
  tipo: string;
  contenido: string;
}

export interface Tarea {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  recordatorio: string | null;
  recordada: boolean;
  completada: boolean;
  fechaRealizacion: string | null;
  documentos: DocumentoTarea[];
}
