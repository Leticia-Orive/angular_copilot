import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Configuración global de arranque para la aplicación en navegador.
// Aquí se registran proveedores compartidos por toda la app.
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo global de errores no controlados del lado cliente.
    provideBrowserGlobalErrorListeners(),
    // Registro del enrutador con las rutas de la aplicación.
    provideRouter(routes),
    // Habilita hidratación del HTML renderizado y reejecución de eventos capturados.
    // Esto mejora la transición SSR -> cliente sin perder interacciones tempranas.
    provideClientHydration(withEventReplay()),
  ],
};
