import { RenderMode, ServerRoute } from '@angular/ssr';

// Rutas del servidor: actualmente todo se prerenderiza.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
