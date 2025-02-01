import { Component, OnDestroy, OnInit } from '@angular/core';
import { Factura } from '../../facturas/interfaces';
import { Departamento, Empresa } from 'src/app/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { MetodoPago } from '../../configuracion/metodo-pagos/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { User } from '../../users/interfaces';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportesService } from '../service/reportes.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent implements OnInit, OnDestroy {

  facturas: Factura[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  sedes: Sede[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  metodos_pagos: MetodoPago[] = [];
  categorias: Categoria[] = [];
  vendedores: User[] = [];

  user: User;

  segmento_cliente_id: number = 9999999;
  categoria_id: number = 9999999;
  vendedor_id: number = 9999999;
  metodo_pago_id: number = 9999999;
  sede_id: number = 9999999;
  fecha_inicio: string = '';
  fecha_final: string = '';

  constructor(
    public modalService: NgbModal,
    public reporteService: ReportesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.reporteService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.setCurrentDate();
    this.closeSidebar();
    this.listar();
  }

  setCurrentDate(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos

    this.fecha_inicio = `${year}-${month}-${day}`;
    this.fecha_final = `${year}-${month}-${day}`;
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

  capitalize(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.sedes = response.sedes;
        this.segmentos_clientes = response.segmentos_clientes;
        this.metodos_pagos = response.metodos_pagos;
        this.categorias = response.categorias;
        this.vendedores = response.vendedores;

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.vendedores = this.vendedores.map(vendedor => {
          return { ...vendedor, name: this.capitalize(vendedor.name) };
        });

        this.categorias = this.categorias.map(categoria => {
          return { ...categoria, nombre: this.capitalize(categoria.nombre) };
        });

        this.segmentos_clientes = this.segmentos_clientes.map(segmentos => {
          return { ...segmentos, nombre: this.capitalize(segmentos.nombre) };
        });

        this.metodos_pagos = this.metodos_pagos.map(metodos => {
          return { ...metodos, nombre: this.capitalize(metodos.nombre) };
        });
        this.isLoadingProcess();
      });
  }

  resetList() {
    this.segmento_cliente_id = 9999999;
    this.categoria_id = 9999999;
    this.vendedor_id = 9999999;
    this.sede_id = 9999999;
    this.metodo_pago_id = 9999999;
    this.setCurrentDate();
    this.listar();
  }

  download() {
    const params = {
      segmento_cliente_id: this.segmento_cliente_id,
      categoria_id: this.categoria_id,
      vendedor_id: this.vendedor_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      empresa_id: this.user.empresa_id,
      sede_id: this.sede_id,
      role_id: this.user.role_id,
      sede_usuario_id: this.user.sede_id ?? 0
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => key === 'buscar' || (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-factura-2' + link, '_BLANK');
  }

  formatFacturaId(id: number): string {
    return `FAC-${id.toString().padStart(6, '0')}`;
  }

  loadPage($event: number) {
    this.listar($event);
  }

  listar(page = 1) {
    this.facturas = [];

    let data = {
      segmento_cliente_id: this.segmento_cliente_id,
      categoria_id: this.categoria_id,
      vendedor_id: this.vendedor_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      sede_id: this.sede_id,
      metodo_pago_id: this.metodo_pago_id,
      sede_usuario_id: this.user.sede_id ?? 0
    };

    this.reporteService.ventas(page, data).subscribe((resp) => {

      if (resp && resp.facturas && resp.facturas.data) {
        this.facturas = resp.facturas.data.map((factura) => ({
          ...factura,
          estado: Number(factura.estado), // Convierte el estado a número
        }));

        this.totalPages = resp.total; // Asigna el total de páginas desde `resp.total`
        this.currentPage = page; // Página actual

      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
    });
  }

  getTotalVenta(): number {
    return this.facturas
      .filter(factura => factura.estado === 1) // Filtrar solo facturas con estado 1
      .reduce((total, factura) => {
        return total + (factura.sub_total - factura.total_descuento + factura.total_iva);
      }, 0);
  }

  getBadgeClass(estado: number): string {
    switch (estado) {
      case 1:
        return 'badge badge-danger fs-7 fw-bold'; // Rojo
      case 2:
        return 'badge badge-warning fs-7 fw-bold'; // Amarillo
      case 3:
        return 'badge badge-success fs-7 fw-bold'; // Verde
      default:
        return 'badge badge-secondary fs-7 fw-bold'; // Gris (DESCONOCIDO)
    }
  }

  getEstadoPagoText(estado: number): string {
    switch (estado) {
      case 1:
        return 'PENDIENTE';
      case 2:
        return 'PARCIAL';
      case 3:
        return 'PAGADA';
      default:
        return 'DESCONOCIDO';
    }
  }

  exportPdf() {
    const params = {
      segmento_cliente_id: this.segmento_cliente_id,
      categoria_id: this.categoria_id,
      vendedor_id: this.vendedor_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      empresa_id: this.user.empresa_id,
      sede_id: this.sede_id,
      role_id: this.user.role_id,
      sede_usuario_id: this.user.sede_id ?? 0
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => key === 'buscar' || (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/pdf/ventas' + link, '_BLANK');
  }

  isLoadingProcess() {
    this.reporteService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.reporteService.isLoadingSubject.next(false);
    }, 50);
  }
}
