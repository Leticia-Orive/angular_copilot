import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Función de arranque usada por SSR para renderizar la app en servidor.
const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

// Export por defecto requerido por el runtime de Angular SSR.
export default bootstrap;
