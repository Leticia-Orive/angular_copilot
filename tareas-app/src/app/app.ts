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
  // Estado reactivo con el título base de la app.
  // Se declara con `signal` para que Angular detecte y refleje cambios automáticamente en la UI.
  protected readonly title = signal('tareas-app');
}
