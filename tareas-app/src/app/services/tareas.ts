
import { Injectable } from '@angular/core';
import { DocumentoTarea, Tarea } from '../models/tarea';

// Clave única usada para guardar/leer tareas en localStorage.
const STORAGE_KEY = 'tareas_app_v1';

@Injectable({
  providedIn: 'root',
})
export class Tareas {
  // Estado en memoria de las tareas; se inicializa desde localStorage.
  private tareas: Tarea[] = this.cargar();

  // Devuelve todas las tareas (pendientes y completadas).
  listar(): Tarea[] {
    return this.tareas;
  }

  // Crea una nueva tarea y la guarda en localStorage.
  agregar(titulo: string, categoria: string, fecha: string, recordatorio: string): void {
    const recordatorioNormalizado = recordatorio.trim() || null;

    const nueva: Tarea = {
      id: Date.now(),
      titulo: titulo.trim(),
      categoria: categoria.trim() || 'General',
      fecha: fecha || this.fechaActualISO(),
      recordatorio: recordatorioNormalizado,
      recordada: false,
      completada: false,
      finalizadaPorDia: false,
      fechaRealizacion: null,
      fechaFinalizacionDia: null,
      documentos: [],
    };

    if (!nueva.titulo) return;

    this.tareas = [nueva, ...this.tareas];
    this.guardar();
  }

  // Cambia el estado de completada/no completada y actualiza su fecha de realización.
  toggle(id: number): void {
    this.tareas = this.tareas.map(t => {
      if (t.id !== id) {
        return t;
      }

      const completada = !t.completada;
      return {
        ...t,
        completada,
        finalizadaPorDia: false,
        fechaRealizacion: completada ? new Date().toISOString() : null,
        fechaFinalizacionDia: null,
      };
    });
    this.guardar();
  }

  // Marca una tarea como finalizada por hoy sin terminarla definitivamente.
  marcarFinalizadaPorDia(id: number): void {
    this.tareas = this.tareas.map(t => {
      if (t.id !== id || t.completada) {
        return t;
      }

      return {
        ...t,
        finalizadaPorDia: true,
        fechaFinalizacionDia: new Date().toISOString(),
      };
    });
    this.guardar();
  }

  // Filtra y devuelve solo tareas ya completadas.
  listarRealizadas(): Tarea[] {
    return this.tareas.filter(t => t.completada);
  }

  // Devuelve tareas finalizadas por hoy pero no terminadas definitivamente.
  listarFinalizadasPorDiaNoTerminadas(): Tarea[] {
    const hoy = this.fechaActualISO();
    return this.tareas.filter(t => {
      if (t.completada || !t.finalizadaPorDia || !t.fechaFinalizacionDia) {
        return false;
      }

      return t.fechaFinalizacionDia.slice(0, 10) === hoy;
    });
  }

  // Añade un documento adjunto a una tarea específica.
  adjuntarDocumento(id: number, documento: DocumentoTarea): void {
    this.tareas = this.tareas.map(t => {
      if (t.id !== id) {
        return t;
      }

      return {
        ...t,
        documentos: [...t.documentos, documento],
      };
    });
    this.guardar();
  }

  // Marca una tarea como recordada para evitar notificaciones repetidas.
  marcarRecordada(id: number): void {
    this.tareas = this.tareas.map(t =>
      t.id === id ? { ...t, recordada: true } : t
    );
    this.guardar();
  }

  // Elimina una tarea por su identificador.
  eliminar(id: number): void {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardar();
  }

  // Persiste el estado actual en localStorage (si existe entorno navegador).
  private guardar(): void {
    const storage = this.obtenerStorage();
    if (!storage) return;

    storage.setItem(STORAGE_KEY, JSON.stringify(this.tareas));
  }

  // Lee tareas desde localStorage y normaliza valores para evitar datos inválidos.
  private cargar(): Tarea[] {
    const storage = this.obtenerStorage();
    if (!storage) return [];

    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Array<Partial<Tarea>>;
    return parsed.map(t => ({
      id: t.id ?? Date.now(),
      titulo: t.titulo?.trim() ?? '',
      categoria: t.categoria?.trim() || 'General',
      fecha: t.fecha || this.fechaActualISO(),
      recordatorio: t.recordatorio?.trim() || null,
      recordada: Boolean(t.recordada),
      completada: Boolean(t.completada),
      finalizadaPorDia: Boolean(t.finalizadaPorDia),
      fechaRealizacion: t.fechaRealizacion || null,
      fechaFinalizacionDia: t.fechaFinalizacionDia || null,
      documentos: Array.isArray(t.documentos)
        ? t.documentos
            .filter(doc => !!doc?.nombre && !!doc?.contenido)
            .map(doc => ({
              nombre: doc.nombre,
              tipo: doc.tipo || 'application/octet-stream',
              contenido: doc.contenido,
            }))
        : [],
    }));
  }

  // Devuelve localStorage solo cuando la app corre en navegador.
  private obtenerStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  }

  // Genera la fecha actual con formato YYYY-MM-DD.
  private fechaActualISO(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
``
