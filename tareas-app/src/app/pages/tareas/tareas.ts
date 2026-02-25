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

  constructor(private tareasService: TareasService) {}

  get tareas(): Tarea[] {
    return this.tareasService.listar();
  }

  agregar(): void {
    this.tareasService.agregar(this.titulo);
    this.titulo = '';
  }

  toggle(id: number): void {
    this.tareasService.toggle(id);
  }

  eliminar(id: number): void {
    this.tareasService.eliminar(id);
  }
}
