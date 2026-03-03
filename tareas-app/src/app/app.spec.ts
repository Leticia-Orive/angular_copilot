import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

// Suite de pruebas del componente raíz `App`.
describe('App', () => {
  beforeEach(async () => {
    // Configura entorno de pruebas cargando el componente standalone.
    await TestBed.configureTestingModule({
      imports: [App],
      // Proveedor de router necesario para `routerLink`, `routerLinkActive` y `router-outlet`.
      providers: [provideRouter([])],
    }).compileComponents();
  });

  // Verifica que la aplicación principal se instancie correctamente.
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Comprueba que la barra de navegación principal se renderiza con sus enlaces.
  it('should render navigation links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const enlaces = Array.from(compiled.querySelectorAll('a')).map(a => a.textContent?.trim());
    expect(enlaces).toContain('Tareas');
    expect(enlaces).toContain('Realizadas');
  });
});
