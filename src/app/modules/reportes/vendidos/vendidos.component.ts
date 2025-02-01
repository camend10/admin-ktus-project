import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../users/interfaces';
import { Articulo } from '../../articulos/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { ReportesService } from '../service/reportes.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ArticuloElement, ArticuloIndex } from '../interfaces';

@Component({
  selector: 'app-vendidos',
  templateUrl: './vendidos.component.html',
  styleUrl: './vendidos.component.scss'
})
export class VendidosComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  totalPages: number = 0;
  currentPage: number = 1;
  user: User;
  articulos: ArticuloIndex[] = [];
  vendedores: User[] = [];

  categoria_id: number = 9999999;
  sede_id: number = 9999999;
  proveedor_id: number = 9999999;
  fecha_inicio: string = '';
  fecha_final: string = '';
  vendedor_id: number = 9999999;

  sedes: Sede[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  constructor(
    public reporteService: ReportesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
    public modalService: NgbModal,
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

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.sedes = response.sedes;
        this.categorias = response.categorias;
        this.proveedores = response.proveedores;
        this.vendedores = response.vendedores;

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.proveedores = this.proveedores.map(proveedor => {
          return {
            ...proveedor, nombre: this.capitalize(proveedor.nombres),
            apellidos: proveedor.apellidos === null ? this.capitalize(proveedor.apellidos) : ''
          };
        });

        this.categorias = this.categorias.map(categoria => {
          return { ...categoria, nombre: this.capitalize(categoria.nombre) };
        });

        this.vendedores = this.vendedores.map(vendedor => {
          return { ...vendedor, name: this.capitalize(vendedor.name) };
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

  listar(page = 1) {
    this.articulos = [];

    let data = {
      categoria_id: this.categoria_id,
      sede_id: this.sede_id,
      proveedor_id: this.proveedor_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      vendedor_id: this.vendedor_id,
    };

    this.reporteService.vendidos(page, data).subscribe((resp) => {
      // Verifica si existe `resp.articulos.data` antes de procesar
      if (resp && resp.articulos && resp.articulos.data) {
        // Supongamos que recibes la respuesta de Laravel en una variable llamada `resp`
        this.articulos = resp.articulos.data.map(item => {
          return {
            ...item.articulo, // Copia todas las propiedades del objeto `articulo`
            articulo_id: item.articulo_id,
            total_vendido: item.total_vendido,
            unidad: item.unidad
          };
        });

        this.totalPages = resp.total; // Asigna el total de páginas desde `resp.total`
        this.currentPage = page; // Página actual
      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
    });
  }

  resetList() {
    this.categoria_id = 9999999;
    this.sede_id = 9999999;
    this.proveedor_id = 9999999;
    this.vendedor_id = 9999999;
    this.setCurrentDate();
    this.listar();
  }

  download() {

    const params = {
      categoria_id: this.categoria_id,
      sede_id: this.sede_id,
      proveedor_id: this.proveedor_id,
      empresa_id: this.user.empresa_id,
      sede_usuario_id: this.user.sede_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      vendedor_id: this.vendedor_id,
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => (value !== undefined && value !== null))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-vendidos' + link, '_BLANK');
  }

  exportPdf() {

    const params = {
      categoria_id: this.categoria_id,
      sede_id: this.sede_id,
      proveedor_id: this.proveedor_id,
      empresa_id: this.user.empresa_id,
      sede_usuario_id: this.user.sede_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      vendedor_id: this.vendedor_id,
    };

    const queryString = Object.entries(params)
      .filter(([key, value]) => (value !== undefined && value !== null))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/pdf/vendidos' + link, '_BLANK');
  }

  getCantidadUnidadYSede(item: ArticuloIndex): { cantidad: number; unidad: string; sede: string } {
    if (!item.bodegas_articulos || !this.user?.sede_id) {
      return { cantidad: 0, unidad: '', sede: '' }; // Valores predeterminados si faltan datos
    }

    const bodegaArticulo = item.bodegas_articulos.find(
      bodega =>
        Number(bodega.unidad?.id) === Number(item.punto_pedido_unidad_id) &&
        Number(bodega.bodega?.sede_id) === Number(this.user.sede_id)
    );

    return {
      cantidad: bodegaArticulo?.cantidad || 0,
      unidad: bodegaArticulo?.unidad?.nombre || '', // Nombre de la unidad
      sede: bodegaArticulo?.bodega?.nombre || '', // Nombre de la sede
    };
  }

  loadPage($event: number) {
    this.listar($event);
  }
}
