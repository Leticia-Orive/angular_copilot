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

  // Obtiene tareas finalizadas por hoy que aún no están terminadas.
  get tareasFinalizadasPorDiaNoTerminadas(): Tarea[] {
    return this.tareasService.listarFinalizadasPorDiaNoTerminadas();
  }

  // Obtiene solo el listado de tareas completadas.
  get tareasRealizadas(): Tarea[] {
    return this.tareasService.listarRealizadas();
  }

  // Marca como terminada una tarea que estaba finalizada por hoy.
  terminarTarea(id: number): void {
    this.tareasService.toggle(id);
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
    // Recupera el input que disparó el evento para acceder al archivo elegido.
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // Si el usuario cancela la selección, no hacemos nada.
    if (!file) {
      return;
    }

    // Usamos FileReader para convertir el archivo a DataURL y poder persistirlo.
    const reader = new FileReader();
    reader.onload = () => {
      // `result` puede no ser string; validamos antes de guardar.
      const contenido = typeof reader.result === 'string' ? reader.result : null;
      if (!contenido) {
        return;
      }

      // Adjunta metadatos + contenido del archivo en la tarea correspondiente.
      this.tareasService.adjuntarDocumento(tareaId, {
        nombre: file.name,
        tipo: file.type || 'application/octet-stream',
        contenido,
      });
      // Limpia el input para permitir subir de nuevo el mismo archivo si se desea.
      input.value = '';
    };
    // Inicia lectura del archivo en formato DataURL.
    reader.readAsDataURL(file);
  }
}
