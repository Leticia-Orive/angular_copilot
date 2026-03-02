import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Tarea } from '../../models/tarea';
import { Tareas as TareasService } from '../../services/tareas';

// Muestra tareas completadas y permite adjuntar documentación.
@Component({
  selector: 'app-realizadas',
  imports: [CommonModule],
  templateUrl: './realizadas.html',
  styleUrl: './realizadas.css',
})
export class Realizadas {
  constructor(private tareasService: TareasService) {}

  // Obtiene solo el listado de tareas completadas.
  get tareasRealizadas(): Tarea[] {
    return this.tareasService.listarRealizadas();
  }

  // Convierte la fecha ISO en texto legible para la vista.
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

  // Lee el archivo seleccionado y lo guarda como adjunto de la tarea.
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
