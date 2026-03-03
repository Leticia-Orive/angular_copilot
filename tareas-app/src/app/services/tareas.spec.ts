import { TestBed } from '@angular/core/testing';

import { Tareas } from './tareas';

// Suite de pruebas del servicio `Tareas`.
// Aquí validamos que el servicio se cree correctamente y que sus filtros funcionen.
describe('Tareas', () => {
  let service: Tareas;

  beforeEach(() => {
    // Limpiamos el almacenamiento local para que cada prueba empiece desde cero.
    window.localStorage.clear();
    // Configuramos el entorno de pruebas de Angular e inyectamos el servicio.
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tareas);
  });

  // Prueba básica: verifica que el servicio se instancia sin errores.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verifica que solo se devuelvan tareas marcadas como "finalizadas por día"
  // que aún NO están completamente terminadas.
  it('debería listar solo tareas finalizadas por hoy y no terminadas', () => {
    // Fecha de hoy en formato YYYY-MM-DD para comparar por día.
    const hoy = new Date().toISOString().slice(0, 10);
    // Fecha y hora actual en formato ISO para campos de auditoría.
    const ahoraISO = new Date().toISOString();

    // Cargamos un conjunto controlado de tareas para probar el filtro:
    // - Tarea A: finalizada por día y no completada (debe aparecer)
    // - Tarea B: completada totalmente (no debe aparecer)
    // - Tarea C: sin finalizar por día (no debe aparecer)
    (service as any).tareas = [
      {
        id: 101,
        titulo: 'Tarea A',
        categoria: 'General',
        fecha: hoy,
        recordatorio: null,
        recordada: false,
        completada: false,
        finalizadaPorDia: true,
        fechaRealizacion: null,
        fechaFinalizacionDia: ahoraISO,
        documentos: [],
      },
      {
        id: 102,
        titulo: 'Tarea B',
        categoria: 'General',
        fecha: hoy,
        recordatorio: null,
        recordada: false,
        completada: true,
        finalizadaPorDia: false,
        fechaRealizacion: ahoraISO,
        fechaFinalizacionDia: null,
        documentos: [],
      },
      {
        id: 103,
        titulo: 'Tarea C',
        categoria: 'General',
        fecha: hoy,
        recordatorio: null,
        recordada: false,
        completada: false,
        finalizadaPorDia: false,
        fechaRealizacion: null,
        fechaFinalizacionDia: null,
        documentos: [],
      },
    ];

    // Ejecutamos el método a validar.
    const resultado = service.listarFinalizadasPorDiaNoTerminadas();

    // Comprobamos que solo se devuelve la tarea esperada.
    expect(resultado.length).toBe(1);
    expect(resultado[0].titulo).toBe('Tarea A');
    expect(resultado[0].completada).toBe(false);
    expect(resultado[0].finalizadaPorDia).toBe(true);
  });
});
