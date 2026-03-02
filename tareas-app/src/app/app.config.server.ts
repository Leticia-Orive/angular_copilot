import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// Configuración específica de servidor para renderizado SSR/prerender.
const serverConfig: ApplicationConfig = {
  providers: [
    // Habilita renderizado en servidor usando las rutas de SSR.
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

// Combina la configuración de navegador con la de servidor.
export const config = mergeApplicationConfig(appConfig, serverConfig);
