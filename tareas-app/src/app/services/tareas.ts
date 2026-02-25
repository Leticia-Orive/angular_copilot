
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

  agregar(titulo: string): void {
    const nueva: Tarea = {
      id: Date.now(),
      titulo: titulo.trim(),
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
    return raw ? (JSON.parse(raw) as Tarea[]) : [];
  }

  private obtenerStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  }
}
``
