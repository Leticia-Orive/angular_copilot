import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tareas } from './tareas';

// Suite de pruebas del componente de tareas.
// Valida que el componente pueda inicializarse correctamente.
describe('Tareas', () => {
  let component: Tareas;
  let fixture: ComponentFixture<Tareas>;

  beforeEach(async () => {
    // Configura el módulo de pruebas importando el componente standalone.
    await TestBed.configureTestingModule({
      imports: [Tareas]
    })
    .compileComponents();

    // Crea la instancia del componente y espera su estabilización inicial.
    fixture = TestBed.createComponent(Tareas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Prueba base: el componente debe crearse sin errores.
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
