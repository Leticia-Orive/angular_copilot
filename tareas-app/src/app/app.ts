import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Componente raíz de la aplicación. Contiene el layout principal y navegación.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Título reactivo usado en la vista principal.
  protected readonly title = signal('tareas-app');
}
