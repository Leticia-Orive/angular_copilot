import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Configuración global para la ejecución en navegador.
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo global de errores no controlados del lado cliente.
    provideBrowserGlobalErrorListeners(),
    // Registro del enrutador con las rutas de la aplicación.
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
