import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// Configuración específica de servidor para renderizado SSR/prerender.
const serverConfig: ApplicationConfig = {
  providers: [
    // Habilita renderizado en servidor usando las rutas de SSR.
    // `withRoutes(serverRoutes)` indica qué estrategia de render aplica por ruta.
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};

// Combina la configuración de navegador con la de servidor.
// Así compartimos providers comunes y añadimos solo lo necesario para SSR.
export const config = mergeApplicationConfig(appConfig, serverConfig);
