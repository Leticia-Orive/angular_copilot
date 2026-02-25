import { Routes } from '@angular/router';
import { Tareas as TareasComponent } from './pages/tareas/tareas';

export const routes: Routes = [
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
  { path: 'tareas', component: TareasComponent },

];
