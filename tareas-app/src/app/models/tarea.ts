// Representa un archivo/documento adjuntado a una tarea realizada.
export interface DocumentoTarea {
  // Nombre original del archivo (ej: informe.pdf).
  nombre: string;
  // Tipo MIME del archivo (ej: application/pdf).
  tipo: string;
  // Contenido codificado en formato Data URL para poder persistirlo en localStorage.
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
  // Fecha/hora opcional para disparar un recordatorio al usuario.
  recordatorio: string | null;
  // Evita notificaciones repetidas: true cuando el recordatorio ya se mostró.
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
