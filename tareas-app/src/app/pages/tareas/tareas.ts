import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tarea } from '../../models/tarea';
import { Tareas as TareasService } from '../../services/tareas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Componente principal: permite crear, listar, completar y eliminar tareas.
@Component({
  selector: 'app-tareas',
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit, OnDestroy {
  // Campos del formulario de creación de tareas.
  titulo = '';
  categoria = 'General';
  fecha = this.fechaActualISO();
  recordatorio = '';

  // Tarea seleccionada para confirmar eliminación en modal.
  tareaPendienteEliminar: Tarea | null = null;

  // Catálogo de categorías visibles en el formulario y leyenda.
  categorias = ['General', 'Trabajo', 'Estudio', 'Personal', 'Reunión'];

  // Encabezado del calendario iniciando en lunes.
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Mes actual mostrado en el calendario.
  mesActual = new Date();

  // Intervalo para revisar recordatorios vencidos periódicamente.
  private intervaloRecordatorios: ReturnType<typeof setInterval> | null = null;

  // Mapa categoría -> clase CSS para colorear etiquetas visuales.
  readonly coloresCategoria: Record<string, string> = {
    General: 'cat-general',
    Trabajo: 'cat-trabajo',
    Estudio: 'cat-estudio',
    Personal: 'cat-personal',
    Reunión: 'cat-trabajo',
  };

  constructor(
    private tareasService: TareasService,
    private router: Router
  ) {}

  // Inicializa chequeo de recordatorios al cargar el componente.
  ngOnInit(): void {
    this.revisarRecordatoriosVencidos();
    this.intervaloRecordatorios = setInterval(() => {
      this.revisarRecordatoriosVencidos();
    }, 30000);
  }

  // Limpia recursos para evitar fugas de memoria al destruir el componente.
  ngOnDestroy(): void {
    if (this.intervaloRecordatorios) {
      clearInterval(this.intervaloRecordatorios);
    }
  }

  // Lista reactiva de tareas desde el servicio.
  get tareas(): Tarea[] {
    return this.tareasService.listar();
  }

  // Agrupa tareas por categoría para renderizar por secciones.
  get tareasPorCategoria(): Record<string, Tarea[]> {
    return this.tareas.reduce((acc, tarea) => {
      if (!acc[tarea.categoria]) {
        acc[tarea.categoria] = [];
      }

      acc[tarea.categoria].push(tarea);
      return acc;
    }, {} as Record<string, Tarea[]>);
  }

  // Título de mes formateado en español para el calendario.
  get tituloMes(): string {
    return this.mesActual.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  // Construye celdas del calendario y asocia tareas por fecha.
  get celdasCalendario(): Array<{ fecha: string | null; dia: number | null; tareas: Tarea[] }> {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();

    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);

    const offsetLunes = (primerDia.getDay() + 6) % 7;
    const totalDias = ultimoDia.getDate();

    const celdas: Array<{ fecha: string | null; dia: number | null; tareas: Tarea[] }> = [];

    for (let i = 0; i < offsetLunes; i++) {
      celdas.push({ fecha: null, dia: null, tareas: [] });
    }

    for (let day = 1; day <= totalDias; day++) {
      const fecha = this.formatoISO(new Date(year, month, day));
      celdas.push({
        fecha,
        dia: day,
        tareas: this.tareas.filter(t => t.fecha === fecha),
      });
    }

    return celdas;
  }

  // Genera la leyenda visual de categorías con su clase de color.
  get leyendaCategorias(): Array<{ nombre: string; clase: string }> {
    return this.categorias.map(nombre => ({
      nombre,
      clase: this.claseCategoria(nombre),
    }));
  }

  // Crea una tarea nueva y reinicia el formulario.
  agregar(): void {
    this.tareasService.agregar(this.titulo, this.categoria, this.fecha, this.recordatorio);

    if (this.recordatorio) {
      this.solicitarPermisoNotificaciones();
    }

    this.titulo = '';
    this.categoria = 'General';
    this.fecha = this.fechaActualISO();
    this.recordatorio = '';
  }

  // Avanza o retrocede el mes mostrado en calendario.
  cambiarMes(delta: number): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + delta, 1);
  }

  // Alterna el estado completada/no completada de una tarea.
  toggle(id: number): void {
    this.tareasService.toggle(id);
  }

  // Marca la tarea como finalizada por hoy sin terminarla definitivamente.
  marcarComoFinalizadaPorDia(id: number): void {
    this.tareasService.marcarFinalizadaPorDia(id);
    window.alert('Tarea finalizada por hoy 🕒');
  }

  // Marca tarea como realizada y navega a la vista de completadas.
  marcarComoRealizada(id: number): void {
    const tareaActual = this.tareas.find(t => t.id === id);
    const estabaCompletada = Boolean(tareaActual?.completada);

    this.toggle(id);

    if (!estabaCompletada) {
      window.alert('Esta tarea está realizada ✅');
      void this.router.navigate(['/realizadas']);
    }
  }

  // Acción al pulsar una tarea desde el calendario.
  abrirTareaDesdeCalendario(id: number): void {
    const tareaActual = this.tareas.find(t => t.id === id);

    if (!tareaActual) {
      return;
    }

    if (!tareaActual.completada) {
      this.marcarComoRealizada(id);
      return;
    }

    window.alert('Esta tarea ya está realizada ✅');
    void this.router.navigate(['/realizadas']);
  }

  // Elimina la tarea seleccionada.
  eliminar(id: number): void {
    this.tareasService.eliminar(id);
  }

  // Abre confirmación de borrado para una tarea concreta.
  pedirConfirmacionEliminar(tarea: Tarea): void {
    this.tareaPendienteEliminar = tarea;
  }

  // Cancela la eliminación pendiente.
  cancelarEliminacion(): void {
    this.tareaPendienteEliminar = null;
  }

  // Ejecuta eliminación solo si hay una tarea pendiente confirmada.
  confirmarEliminacion(): void {
    if (!this.tareaPendienteEliminar) {
      return;
    }

    this.eliminar(this.tareaPendienteEliminar.id);
    this.tareaPendienteEliminar = null;
  }

  // Devuelve la clase CSS asociada a una categoría.
  claseCategoria(categoria: string): string {
    return this.coloresCategoria[categoria] ?? 'cat-general';
  }

  // Formatea fecha/hora de recordatorio para mostrar en UI.
  textoRecordatorio(fechaHora: string | null): string {
    if (!fechaHora) {
      return '';
    }

    const date = new Date(fechaHora);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  // Pide permiso de notificaciones del navegador cuando aplica.
  private solicitarPermisoNotificaciones(): void {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }

  // Revisa recordatorios vencidos y notifica/avisa al usuario.
  private revisarRecordatoriosVencidos(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const ahora = Date.now();
    const vencidas = this.tareas.filter(t => {
      if (!t.recordatorio || t.recordada || t.completada) {
        return false;
      }

      const fechaRecordatorio = new Date(t.recordatorio).getTime();
      if (Number.isNaN(fechaRecordatorio)) {
        return false;
      }

      return fechaRecordatorio <= ahora;
    });

    if (!vencidas.length) {
      return;
    }

    for (const tarea of vencidas) {
      this.tareasService.marcarRecordada(tarea.id);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Recordatorio de tarea', {
          body: tarea.titulo,
        });
      }
    }

    const lista = vencidas.map(t => `• ${t.titulo}`).join('\n');
    window.alert(`Tienes recordatorios pendientes:\n${lista}`);
  }

  // Fecha actual en formato ISO corto (YYYY-MM-DD).
  private fechaActualISO(): string {
    return this.formatoISO(new Date());
  }

  // Convierte una fecha Date al formato ISO corto usado en la app.
  private formatoISO(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
