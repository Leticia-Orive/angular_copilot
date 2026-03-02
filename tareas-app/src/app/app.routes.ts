import { Routes } from '@angular/router';
import { Tareas as TareasComponent } from './pages/tareas/tareas';
import { Realizadas as RealizadasComponent } from './pages/realizadas/realizadas';

// Definición de rutas de la aplicación.
export const routes: Routes = [
  // Ruta por defecto: redirige al listado de tareas pendientes.
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
  // Pantalla principal para crear y gestionar tareas.
  { path: 'tareas', component: TareasComponent },
  // Pantalla para ver tareas completadas y adjuntar documentos.
  { path: 'realizadas', component: RealizadasComponent },

];
