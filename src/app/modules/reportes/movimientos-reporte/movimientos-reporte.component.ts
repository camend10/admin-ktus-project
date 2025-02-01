import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { User } from '../../users/interfaces';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { ReportesService } from '../service/reportes.service';
import { Movimiento } from '../interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-movimientos-reporte',
  templateUrl: './movimientos-reporte.component.html',
  styleUrl: './movimientos-reporte.component.scss'
})
export class MovimientosReporteComponent implements OnInit, OnDestroy {

  movimientos: Movimiento[] = [];
  isLoading$: Observable<boolean>;

  totalPages: number = 0;
  currentPage: number = 1;

  bodegas: Bodega[] = [];
  bodegasFiltradas: Bodega[] = [];
  sedes: Sede[] = [];

  user: User;

  buscar: string = '';
  bodega_id: number = 9999999;
  sede_id: number = 9999999;
  fecha_inicio: string = '';
  fecha_final: string = '';
  articulo: string = '';
  existencia_inicial: number = -1;
  existencia_final: number = -1;
  total_entradas: number = 0;
  total_salidas: number = 0;
  unidad: string = "";
  nombreArticulo: string = "";

  constructor(
    public reporteService: ReportesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.reporteService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.setCurrentDate();
    this.closeSidebar();
    // this.listar();
  }

  setCurrentDate(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos

    this.fecha_inicio = `${year}-${month}-${day}`;
    this.fecha_final = `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  formatMovimientoId(id: number): string {
    return `MOV-${id.toString().padStart(6, '0')}`;
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.bodegas = response.bodegas;
        this.sedes = response.sedes;
        // this.isLoadingProcess();
        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });
        this.cdr.detectChanges();
      });
  }

  capitalize(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onFechaInicioChange(): void {
    // Si la fecha final es menor que la fecha inicial, actualiza la fecha final
    if (this.fecha_final < this.fecha_inicio) {
      this.fecha_final = this.fecha_inicio;
    }
  }

  onFechaFinalChange(): void {
    // Si la fecha inicial es mayor que la fecha final, actualiza la fecha inicial
    if (this.fecha_inicio > this.fecha_final) {
      this.fecha_inicio = this.fecha_final;
    }
  }

  resetList() {
    this.buscar = '';
    this.bodega_id = 9999999;
    this.sede_id = 9999999;
    this.setCurrentDate();
    this.articulo = '';
    this.listar();
  }

  changeSede() {
    this.movimientos = [];
    if (this.sede_id !== 9999999) {
      // Filtra las bodegas según el sede_id seleccionado
      const bodegasFiltradas = this.bodegas.filter((bodega) => Number(bodega.sede_id) === Number(this.sede_id));
      this.bodegasFiltradas = bodegasFiltradas;
    } else {
      this.bodegasFiltradas = this.bodegas;
    }
  }

  changeBodega() {
    this.movimientos = [];
  }

  listar() {
    this.movimientos = [];

    if (this.sede_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar una sede");
      return;
    }

    if (this.bodega_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar una bodega");
      return;
    }

    if (!this.articulo) {
      this.toast.error("Validando", "Necesitas digitar un articulo");
      return;
    }

    let data = {
      sede_id: this.sede_id,
      bodega_id: this.bodega_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      articulo: this.articulo,
    };

    this.reporteService.movimientos(data).subscribe((resp) => {
      this.movimientos = resp.movimientos;
      this.existencia_inicial = resp.existencia_inicial;
      this.existencia_final = resp.existencia_final;
      this.total_entradas = resp.total_entradas;
      this.total_salidas = resp.total_salidas;
      this.unidad = resp.unidad;
      this.articulo = resp.nombreArticulo;
    });
  }

  exportPdf() {


    if (this.sede_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar una sede");
      return;
    }

    if (this.bodega_id === 9999999) {
      this.toast.error("Validando", "Necesitas seleccionar una bodega");
      return;
    }

    if (!this.articulo) {
      this.toast.error("Validando", "Necesitas digitar un articulo");
      return;
    }

    const params = {
      sede_id: this.sede_id,
      bodega_id: this.bodega_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      articulo: this.articulo,
      empresa_id: this.user.empresa_id,
      sede_usuario_id: this.user.sede_id,
    };

    const queryString = Object.entries(params)
      .filter(([key, value]) => (value !== undefined && value !== null))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/pdf/movimientos' + link, '_BLANK');
  }

}
