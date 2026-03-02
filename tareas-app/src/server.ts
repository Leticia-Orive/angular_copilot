import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Servidor Express que entrega estáticos y delega el renderizado a Angular SSR.
const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Aquí puedes definir endpoints REST de Express.
 * Descomenta y adapta según tus necesidades.
 *
 * Ejemplo:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Gestionar petición API
 * });
 * ```
 */

/**
 * Sirve archivos estáticos desde /browser.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Gestiona el resto de rutas renderizando la aplicación Angular.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Inicia el servidor si este módulo es el punto de entrada principal o si se ejecuta con PM2.
 * Escucha en el puerto definido por la variable de entorno `PORT`, o en 4000 por defecto.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Servidor Node + Express escuchando en http://localhost:${port}`);
  });
}

/**
 * Manejador de peticiones usado por Angular CLI (dev-server y build)
 * o por Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
