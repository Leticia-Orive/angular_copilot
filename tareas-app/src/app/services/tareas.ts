
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
    // Normaliza el recordatorio: si llega vacío o con espacios, se guarda como null.
    const recordatorioNormalizado = recordatorio.trim() || null;

    // Construye la nueva tarea con valores por defecto para mantener consistencia.
    const nueva: Tarea = {
      // Se usa timestamp como id simple y suficiente para este caso.
      id: Date.now(),
      titulo: titulo.trim(),
      categoria: categoria.trim() || 'General',
      fecha: fecha || this.fechaActualISO(),
      recordatorio: recordatorioNormalizado,
      // Estado inicial de una tarea recién creada.
      recordada: false,
      completada: false,
      finalizadaPorDia: false,
      fechaRealizacion: null,
      fechaFinalizacionDia: null,
      // Arranca sin adjuntos.
      documentos: [],
    };

    // Si el título queda vacío tras trim(), no se crea la tarea.
    if (!nueva.titulo) return;

    // Inserta la tarea al inicio para mostrar primero las más recientes.
    this.tareas = [nueva, ...this.tareas];
    // Persiste cambios.
    this.guardar();
  }

  // Cambia el estado de completada/no completada y actualiza su fecha de realización.
  toggle(id: number): void {
    // Recorre todas las tareas y modifica solo la que coincide con el id.
    this.tareas = this.tareas.map(t => {
      if (t.id !== id) {
        return t;
      }

      // Invierte el estado actual (toggle).
      const completada = !t.completada;
      return {
        ...t,
        completada,
        // Si se completa, deja de estar en "finalizada por día".
        finalizadaPorDia: false,
        // Guarda la fecha real de finalización total; si se desmarca, se limpia.
        fechaRealizacion: completada ? new Date().toISOString() : null,
        // Al completar o descompletar, se reinicia este campo temporal.
        fechaFinalizacionDia: null,
      };
    });
    this.guardar();
  }

  // Marca una tarea como finalizada por hoy sin terminarla definitivamente.
  marcarFinalizadaPorDia(id: number): void {
    this.tareas = this.tareas.map(t => {
      // No tocar otras tareas ni las ya completadas definitivamente.
      if (t.id !== id || t.completada) {
        return t;
      }

      return {
        ...t,
        // Marca cierre diario (temporal).
        finalizadaPorDia: true,
        // Registra cuándo se hizo ese cierre del día.
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
    // Fecha de referencia del día actual en formato YYYY-MM-DD.
    const hoy = this.fechaActualISO();
    return this.tareas.filter(t => {
      // Descarta: completadas, no marcadas por día o sin fecha de cierre diario.
      if (t.completada || !t.finalizadaPorDia || !t.fechaFinalizacionDia) {
        return false;
      }

      // Compara solo la parte de fecha (sin hora) para validar que sea "hoy".
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
        // Se mantiene inmutabilidad creando un nuevo array de documentos.
        documentos: [...t.documentos, documento],
      };
    });
    this.guardar();
  }

  // Marca una tarea como recordada para evitar notificaciones repetidas.
  marcarRecordada(id: number): void {
    // Solo cambia la bandera `recordada` de la tarea objetivo.
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
    // En SSR/no navegador, localStorage no existe.
    const storage = this.obtenerStorage();
    if (!storage) return;

    // Serializa y guarda el array completo de tareas.
    storage.setItem(STORAGE_KEY, JSON.stringify(this.tareas));
  }

  // Lee tareas desde localStorage y normaliza valores para evitar datos inválidos.
  private cargar(): Tarea[] {
    const storage = this.obtenerStorage();
    if (!storage) return [];

    // Carga el JSON guardado con la clave definida del módulo.
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    // Convierte desde JSON a estructura parcial para luego sanear campo a campo.
    const parsed = JSON.parse(raw) as Array<Partial<Tarea>>;
    return parsed.map(t => ({
      // Fallbacks para evitar undefined/null donde no corresponde.
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
      // Valida documentos y normaliza el tipo MIME si faltara.
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
