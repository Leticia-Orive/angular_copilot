import { TestBed } from '@angular/core/testing';

import { Tareas } from './tareas';

describe('Tareas', () => {
  let service: Tareas;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tareas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería listar solo tareas finalizadas por hoy y no terminadas', () => {
    const hoy = new Date().toISOString().slice(0, 10);
    const ahoraISO = new Date().toISOString();

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

    const resultado = service.listarFinalizadasPorDiaNoTerminadas();

    expect(resultado.length).toBe(1);
    expect(resultado[0].titulo).toBe('Tarea A');
    expect(resultado[0].completada).toBe(false);
    expect(resultado[0].finalizadaPorDia).toBe(true);
  });
});
