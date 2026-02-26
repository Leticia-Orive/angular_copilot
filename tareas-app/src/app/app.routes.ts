import { Routes } from '@angular/router';
import { Tareas as TareasComponent } from './pages/tareas/tareas';
import { Realizadas as RealizadasComponent } from './pages/realizadas/realizadas';

export const routes: Routes = [
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
  { path: 'tareas', component: TareasComponent },
  { path: 'realizadas', component: RealizadasComponent },

];
