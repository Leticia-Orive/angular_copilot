import { Component } from '@angular/core';
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
export class Tareas {
  titulo = '';
  categoria = 'General';
  fecha = this.fechaActualISO();
  categorias = ['General', 'Trabajo', 'Estudio', 'Personal'];
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  mesActual = new Date();

  constructor(private tareasService: TareasService) {}

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

  agregar(): void {
    this.tareasService.agregar(this.titulo, this.categoria, this.fecha);
    this.titulo = '';
    this.categoria = 'General';
    this.fecha = this.fechaActualISO();
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

  private fechaActualISO(): string {
    return this.formatoISO(new Date());
  }

  private formatoISO(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
