# TareasApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Convenciones de comentarios (español)

Para mantener una documentación clara y consistente en el código:

- Escribe comentarios cortos y directos, explicando **para qué sirve** el bloque o método.
- Prioriza explicar el **por qué** de validaciones o decisiones (no solo el “qué”).
- Usa un tono técnico simple y uniforme en todo el proyecto.
- Evita comentarios redundantes en líneas obvias (por ejemplo, asignaciones triviales).
- Mantén comentarios actualizados cuando cambie la lógica.

### Guía rápida por tipo de archivo

- **Componentes (`*.ts`)**: comenta propósito del componente, getters clave, métodos públicos y validaciones importantes.
- **Servicios (`*.ts`)**: comenta reglas de negocio, persistencia, normalización de datos y filtros.
- **Modelos (`*.ts`)**: comenta significado de cada campo y formato esperado de datos.
- **Rutas/config (`app.routes.ts`, `app.config*.ts`)**: comenta flujo de navegación y proveedores globales.
- **Plantillas (`*.html`)**: comenta secciones principales de UI, estados vacíos y acciones de usuario.
- **Pruebas (`*.spec.ts`)**: comenta qué valida cada test y el objetivo del dataset de prueba.

### Ejemplos recomendados

```ts
// Recorre todas las tareas y modifica solo la que coincide con el id.
// Si no hay recordatorio válido, se ignora para evitar errores en tiempo de ejecución.
```

```html
<!-- Modal de confirmación de eliminación -->
<!-- Estado vacío cuando no hay tareas -->
```
