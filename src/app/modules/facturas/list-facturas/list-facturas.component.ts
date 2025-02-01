import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission, URL_SERVICIOS } from 'src/app/config/config';
import { Sede } from '../../configuracion/sedes/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { FacturasService } from '../service/facturas.service';
import { SedeDeliverie } from '../../configuracion/sede-deliveries/interfaces';
import { MetodoPago } from '../../configuracion/metodo-pagos/interfaces';
import { DeleteFacturaComponent } from '../delete-factura/delete-factura.component';
import { Factura } from '../interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { Cliente } from '../../clientes/interfaces';
import { Articulo } from '../../articulos/interfaces';
import { VerDetalleFacturaComponent } from '../componentes/ver-detalle-factura/ver-detalle-factura.component';


@Component({
  selector: 'app-list-facturas',
  templateUrl: './list-facturas.component.html',
  styleUrl: './list-facturas.component.scss'
})
export class ListFacturasComponent implements OnInit, OnDestroy {

  buscar: string = '';
  facturas: Factura[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  tipodocumentos: TipoDoc[] = [];
  sedes: Sede[] = [];
  generos: Genero[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  sede_deliveries: SedeDeliverie[] = [];
  metodos_pagos: MetodoPago[] = [];
  categorias: Categoria[] = [];
  vendedores: User[] = [];

  user: User;

  segmento_cliente_id: number = 9999999;
  tipo: number = 9999999;
  categoria_id: number = 9999999;
  vendedor_id: number = 9999999;
  sede_id: number = 9999999;

  cliente: string = '';

  articulo: string = ''

  fecha_inicio: string = '';
  fecha_final: string = '';

  constructor(
    public modalService: NgbModal,
    public facturaService: FacturasService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.facturaService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    // this.setCurrentDate();
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

  listar(page = 1) {
    this.facturas = [];

    let data = {
      buscar: this.buscar,
      segmento_cliente_id: this.segmento_cliente_id,
      categoria_id: this.categoria_id,
      vendedor_id: this.vendedor_id,
      cliente: this.cliente,
      articulo: this.articulo,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      sede_id: this.sede_id,
      sede_usuario_id: this.user.sede_id ?? 0
    };

    this.facturaService.listar(page, data).subscribe((resp) => {

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

  formatFacturaId(id: number): string {
    return `FAC-${id.toString().padStart(6, '0')}`;
  }

  loadPage($event: number) {
    this.listar($event);
  }

  cambiarEstado(factura: Factura) {
    const modalRef = this.modalService.open(DeleteFacturaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.FacturaSeleccionado = factura;
    modalRef.componentInstance.FacturaD.subscribe((FacturaR: Factura) => {
      let index = this.facturas.findIndex((FacturaFind: Factura) => FacturaFind.id === factura.id);
      if (index != -1) {
        this.facturas[index] = FacturaR;
      }
    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
        this.sedes = response.sedes;
        this.sede_deliveries = response.sede_deliveries;
        this.tipodocumentos = response.tipodocumentos.filter((doc: TipoDoc) => doc.id === 1 || doc.id === 6);
        this.segmentos_clientes = response.segmentos_clientes;
        this.generos = response.generos;
        this.metodos_pagos = response.metodos_pagos;
        this.categorias = response.categorias;
        this.vendedores = response.vendedores;

        this.vendedores = this.vendedores.map(vendedor => {
          return { ...vendedor, name: this.capitalize(vendedor.name) };
        });

        this.categorias = this.categorias.map(categoria => {
          return { ...categoria, nombre: this.capitalize(categoria.nombre) };
        });

        this.segmentos_clientes = this.segmentos_clientes.map(segmentos => {
          return { ...segmentos, nombre: this.capitalize(segmentos.nombre) };
        });

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.metodos_pagos = this.metodos_pagos.map(metodos => {
          return { ...metodos, nombre: this.capitalize(metodos.nombre) };
        });
        // this.isLoadingProcess();
      });
  }

  resetList() {
    this.buscar = '';
    this.segmento_cliente_id = 9999999;
    this.categoria_id = 9999999;
    this.vendedor_id = 9999999;
    this.cliente = '';
    this.articulo = '';

    this.fecha_inicio = '';
    this.fecha_final = '';
    this.listar();
  }

  download() {
    const params = {
      buscar: this.buscar,
      segmento_cliente_id: this.segmento_cliente_id,
      categoria_id: this.categoria_id,
      vendedor_id: this.vendedor_id,
      cliente: this.cliente,
      articulo: this.articulo,
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

    window.open(URL_SERVICIOS + '/excel/export-factura' + link, '_BLANK');
  }

  getTotalVenta(): number {
    return this.facturas
      .filter(factura => factura.estado === 1) // Filtrar solo facturas con estado 1
      .reduce((total, factura) => {
        return total + (factura.sub_total - factura.total_descuento + factura.total_iva);
      }, 0);
  }

  download_detalle() {
    const params = {
      buscar: this.buscar,
      segmento_cliente_id: this.segmento_cliente_id,
      categoria_id: this.categoria_id,
      vendedor_id: this.vendedor_id,
      cliente: this.cliente,
      articulo: this.articulo,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      empresa_id: this.user.empresa_id,
      sede_id: this.user.sede_id,
      role_id: this.user.role_id,
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => key === 'buscar' || (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-detalle-factura' + link, '_BLANK');
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

  verFactura(factura: Factura) {
    const modalRef = this.modalService.open(VerDetalleFacturaComponent, { centered: true, size: 'xl' });

    modalRef.componentInstance.factura = factura;
    modalRef.componentInstance.ArticuloS.subscribe((factura: Factura) => {

      this.isLoadingProcess();
      // this.toast.success('Exito', 'Se ha seleccionado el articulo');
    });
  }

  imprimirFactura(factura: Factura) {
    const params = {
      id: factura.id,
      empresa_id: this.user.empresa_id,
      user_id: this.user.id
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/facturas/imprimir-factura' + link, '_BLANK', "toolbar=no,scrollbars=no,resizable=no,width=400,height=800");
  }

  isLoadingProcess() {
    this.facturaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.facturaService.isLoadingSubject.next(false);
    }, 50);
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
