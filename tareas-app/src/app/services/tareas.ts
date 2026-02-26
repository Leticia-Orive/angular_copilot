
import { Injectable } from '@angular/core';
import { Tarea } from '../models/tarea';

const STORAGE_KEY = 'tareas_app_v1';

@Injectable({
  providedIn: 'root',
})
export class Tareas {
  private tareas: Tarea[] = this.cargar();

  listar(): Tarea[] {
    return this.tareas;
  }

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
    };

    if (!nueva.titulo) return;

    this.tareas = [nueva, ...this.tareas];
    this.guardar();
  }

  toggle(id: number): void {
    this.tareas = this.tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    this.guardar();
  }

  marcarRecordada(id: number): void {
    this.tareas = this.tareas.map(t =>
      t.id === id ? { ...t, recordada: true } : t
    );
    this.guardar();
  }

  eliminar(id: number): void {
    this.tareas = this.tareas.filter(t => t.id !== id);
    this.guardar();
  }

  private guardar(): void {
    const storage = this.obtenerStorage();
    if (!storage) return;

    storage.setItem(STORAGE_KEY, JSON.stringify(this.tareas));
  }

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
    }));
  }

  private obtenerStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  }

  private fechaActualISO(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
``
