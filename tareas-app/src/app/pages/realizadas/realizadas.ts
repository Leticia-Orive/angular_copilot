import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Tarea } from '../../models/tarea';
import { Tareas as TareasService } from '../../services/tareas';

@Component({
  selector: 'app-realizadas',
  imports: [CommonModule],
  templateUrl: './realizadas.html',
  styleUrl: './realizadas.css',
})
export class Realizadas {
  constructor(private tareasService: TareasService) {}

  get tareasRealizadas(): Tarea[] {
    return this.tareasService.listarRealizadas();
  }

  fechaFormateada(fechaISO: string | null): string {
    if (!fechaISO) {
      return 'Sin fecha';
    }

    const date = new Date(fechaISO);
    if (Number.isNaN(date.getTime())) {
      return 'Sin fecha';
    }

    return date.toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  subirDocumento(event: Event, tareaId: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const contenido = typeof reader.result === 'string' ? reader.result : null;
      if (!contenido) {
        return;
      }

      this.tareasService.adjuntarDocumento(tareaId, {
        nombre: file.name,
        tipo: file.type || 'application/octet-stream',
        contenido,
      });
      input.value = '';
    };
    reader.readAsDataURL(file);
  }
}
