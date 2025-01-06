import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KardexService } from '../service/kardex.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { User } from '../../users/interfaces';
import { isPermission, URL_SERVICIOS } from 'src/app/config/config';
import { KardexArticulo, Unidad } from '../interfaces/index';

@Component({
  selector: 'app-list-kardex',
  templateUrl: './list-kardex.component.html',
  styleUrl: './list-kardex.component.scss'
})
export class ListKardexComponent implements OnInit, OnDestroy {

  isLoading$: any;

  categorias: Categoria[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  bodegas: Bodega[] = [];

  year = 2024;
  years: number[] = [];
  month: string = '';
  months = [
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' },
  ];

  year_current: string = '';
  month_current: string = '';
  bodega_id: number = 9999999;
  articulo: string = '';

  kardexs: KardexArticulo[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public kardexService: KardexService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.generalService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    // this.listar();

    this.initializeYears();
    this.initializeCurrentMonth();
    this.closeSidebar();
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear(); // Año actual
    const startYear = 2024; // Año fijo inicial
    const range = 10; // Número de años en el rango

    // Generar el rango de años asegurando que 2024 esté incluido
    this.years = Array.from({ length: range }, (_, i) => startYear + i);

    // Establecer el año actual como valor predeterminado si está dentro del rango
    this.year = this.years.includes(currentYear) ? currentYear : startYear;
  }


  initializeCurrentMonth(): void {
    const currentMonth = new Date().getMonth() + 1; // Mes actual (1-12)
    this.month = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`; // Formato de dos dígitos
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesConversiones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.bodegas = response.bodegas;

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });

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

  listar() {

    if (this.bodega_id === 9999999) {
      this.toast.error("Validación", "Necesitas seleccionar una bodega");
      return;
    }

    let data = {
      year: this.year,
      month: this.month,
      articulo: this.articulo,
      bodega_id: this.bodega_id,
    };

    this.kardexService.listar(data).subscribe((resp) => {
      this.kardexs = resp.kardex_articulos;
      this.cdr.detectChanges();
      this.isLoadingProcess();
    });

  }

  reset() {
    this.initializeYears();
    this.initializeCurrentMonth();
    // this.bodega_id = 9999999;
    this.articulo = "";
    this.kardexs = [];

    this.listar();
  }

  getNombreUnidad(kardex: KardexArticulo, unidad_id: number) {
    let unidad = kardex.unidades.find((item: Unidad) => item.id === unidad_id);
    return unidad ? unidad?.nombre : '---';
  }

  exportKardex() {
    if (this.bodega_id === 9999999) {
      this.toast.error("Validación", "Necesitas seleccionar una bodega");
      return;
    }

    const params = {
      year: this.year,
      month: this.month,
      articulo: this.articulo,
      bodega_id: this.bodega_id,
      empresa_id: this.user.empresa_id,
      sede_id: this.user.sede_id,
      role_id: this.user.role_id,
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-kardex' + link, '_BLANK');
  }

  isLoadingProcess() {
    this.kardexService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.kardexService.isLoadingSubject.next(false);
    }, 50);
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
