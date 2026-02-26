export interface Tarea {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  recordatorio: string | null;
  recordada: boolean;
  completada: boolean;
}
