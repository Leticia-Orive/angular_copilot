import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Función de arranque usada por SSR para renderizar la app en servidor.
// Recibe el contexto de bootstrap para que Angular gestione la solicitud actual.
const bootstrap = (context: BootstrapContext) =>
    // Arranca la app con configuración de servidor (SSR + rutas de render).
    bootstrapApplication(App, config, context);

// Export por defecto requerido por el runtime de Angular SSR.
export default bootstrap;
