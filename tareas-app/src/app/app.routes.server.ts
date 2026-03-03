import { RenderMode, ServerRoute } from '@angular/ssr';

// Definición de rutas del lado servidor (SSR).
// En este proyecto, cualquier ruta cae en el comodín y se prerenderiza.
export const serverRoutes: ServerRoute[] = [
  {
    // `**` captura todas las rutas no declaradas explícitamente.
    path: '**',
    // Renderiza en build-time para servir HTML estático optimizado.
    renderMode: RenderMode.Prerender
  }
];
