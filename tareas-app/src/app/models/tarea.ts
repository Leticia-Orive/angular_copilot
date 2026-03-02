// Representa un archivo/documento adjuntado a una tarea realizada.
export interface DocumentoTarea {
  // Nombre original del archivo (ej: informe.pdf).
  nombre: string;
  // Tipo MIME del archivo (ej: application/pdf).
  tipo: string;
  // Contenido en formato Data URL para persistirlo en localStorage.
  contenido: string;
}

// Modelo principal de una tarea dentro de la aplicación.
export interface Tarea {
  // Identificador único de la tarea.
  id: number;
  // Texto principal de la tarea.
  titulo: string;
  // Categoría asignada (General, Trabajo, etc.).
  categoria: string;
  // Fecha objetivo de la tarea en formato YYYY-MM-DD.
  fecha: string;
  // Fecha/hora opcional para notificación de recordatorio.
  recordatorio: string | null;
  // Indica si el recordatorio ya fue mostrado.
  recordada: boolean;
  // Indica si la tarea está completada.
  completada: boolean;
  // Indica si la tarea se finalizó solo por hoy (sin terminarla definitivamente).
  finalizadaPorDia: boolean;
  // Fecha/hora en la que se marcó como completada.
  fechaRealizacion: string | null;
  // Fecha/hora en la que se marcó como finalizada por hoy.
  fechaFinalizacionDia: string | null;
  // Documentos asociados a la tarea (solo si se adjuntan).
  documentos: DocumentoTarea[];
}
