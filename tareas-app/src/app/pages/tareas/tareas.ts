import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tarea } from '../../models/tarea';
import { Tareas as TareasService } from '../../services/tareas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tareas',
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit, OnDestroy {
  titulo = '';
  categoria = 'General';
  fecha = this.fechaActualISO();
  recordatorio = '';
  tareaPendienteEliminar: Tarea | null = null;
  categorias = ['General', 'Trabajo', 'Estudio', 'Personal', 'Reunión'];
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  mesActual = new Date();
  private intervaloRecordatorios: ReturnType<typeof setInterval> | null = null;
  readonly coloresCategoria: Record<string, string> = {
    General: 'cat-general',
    Trabajo: 'cat-trabajo',
    Estudio: 'cat-estudio',
    Personal: 'cat-personal',
    Reunión: 'cat-trabajo',
  };

  constructor(private tareasService: TareasService) {}

  ngOnInit(): void {
    this.revisarRecordatoriosVencidos();
    this.intervaloRecordatorios = setInterval(() => {
      this.revisarRecordatoriosVencidos();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.intervaloRecordatorios) {
      clearInterval(this.intervaloRecordatorios);
    }
  }

  get tareas(): Tarea[] {
    return this.tareasService.listar();
  }

  get tareasPorCategoria(): Record<string, Tarea[]> {
    return this.tareas.reduce((acc, tarea) => {
      if (!acc[tarea.categoria]) {
        acc[tarea.categoria] = [];
      }

      acc[tarea.categoria].push(tarea);
      return acc;
    }, {} as Record<string, Tarea[]>);
  }

  get tituloMes(): string {
    return this.mesActual.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  get celdasCalendario(): Array<{ fecha: string | null; dia: number | null; tareas: Tarea[] }> {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();

    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);

    const offsetLunes = (primerDia.getDay() + 6) % 7;
    const totalDias = ultimoDia.getDate();

    const celdas: Array<{ fecha: string | null; dia: number | null; tareas: Tarea[] }> = [];

    for (let i = 0; i < offsetLunes; i++) {
      celdas.push({ fecha: null, dia: null, tareas: [] });
    }

    for (let day = 1; day <= totalDias; day++) {
      const fecha = this.formatoISO(new Date(year, month, day));
      celdas.push({
        fecha,
        dia: day,
        tareas: this.tareas.filter(t => t.fecha === fecha),
      });
    }

    return celdas;
  }

  get leyendaCategorias(): Array<{ nombre: string; clase: string }> {
    return this.categorias.map(nombre => ({
      nombre,
      clase: this.claseCategoria(nombre),
    }));
  }

  agregar(): void {
    this.tareasService.agregar(this.titulo, this.categoria, this.fecha, this.recordatorio);

    if (this.recordatorio) {
      this.solicitarPermisoNotificaciones();
    }

    this.titulo = '';
    this.categoria = 'General';
    this.fecha = this.fechaActualISO();
    this.recordatorio = '';
  }

  cambiarMes(delta: number): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + delta, 1);
  }

  toggle(id: number): void {
    this.tareasService.toggle(id);
  }

  eliminar(id: number): void {
    this.tareasService.eliminar(id);
  }

  pedirConfirmacionEliminar(tarea: Tarea): void {
    this.tareaPendienteEliminar = tarea;
  }

  cancelarEliminacion(): void {
    this.tareaPendienteEliminar = null;
  }

  confirmarEliminacion(): void {
    if (!this.tareaPendienteEliminar) {
      return;
    }

    this.eliminar(this.tareaPendienteEliminar.id);
    this.tareaPendienteEliminar = null;
  }

  claseCategoria(categoria: string): string {
    return this.coloresCategoria[categoria] ?? 'cat-general';
  }

  textoRecordatorio(fechaHora: string | null): string {
    if (!fechaHora) {
      return '';
    }

    const date = new Date(fechaHora);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  private solicitarPermisoNotificaciones(): void {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }

  private revisarRecordatoriosVencidos(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const ahora = Date.now();
    const vencidas = this.tareas.filter(t => {
      if (!t.recordatorio || t.recordada || t.completada) {
        return false;
      }

      const fechaRecordatorio = new Date(t.recordatorio).getTime();
      if (Number.isNaN(fechaRecordatorio)) {
        return false;
      }

      return fechaRecordatorio <= ahora;
    });

    if (!vencidas.length) {
      return;
    }

    for (const tarea of vencidas) {
      this.tareasService.marcarRecordada(tarea.id);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Recordatorio de tarea', {
          body: tarea.titulo,
        });
      }
    }

    const lista = vencidas.map(t => `• ${t.titulo}`).join('\n');
    window.alert(`Tienes recordatorios pendientes:\n${lista}`);
  }

  private fechaActualISO(): string {
    return this.formatoISO(new Date());
  }

  private formatoISO(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
