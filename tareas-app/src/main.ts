import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Punto de entrada del cliente: inicia la aplicación Angular en el navegador.
// Usa el componente raíz `App` y la configuración global definida en `appConfig`.
bootstrapApplication(App, appConfig)
  // Captura errores de arranque para facilitar diagnóstico en desarrollo.
  .catch((err) => console.error(err));
