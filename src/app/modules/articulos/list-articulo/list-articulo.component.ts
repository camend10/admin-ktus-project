import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPermission, URL_SERVICIOS } from 'src/app/config/config';
import { ArticulosService } from '../service/articulos.service';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { User } from '../../users/interfaces';
import { Articulo } from '../interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { Empresa } from 'src/app/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { Iva } from '../../configuracion/ivas/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { DeleteArticuloComponent } from '../delete-articulo/delete-articulo.component';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { ImportArticuloComponent } from '../import-articulo/import-articulo.component';

@Component({
  selector: 'app-list-articulo',
  templateUrl: './list-articulo.component.html',
  styleUrl: './list-articulo.component.scss'
})
export class ListArticuloComponent implements OnInit, OnDestroy {

  buscar: string = '';
  categoria_id: number = 9999999;
  impuesto: number = 9999999;
  sede_id: number = 9999999;
  bodega_id: number = 9999999;
  segmento_cliente_id: number = 9999999;
  unidad_id_bodegas: number = 9999999;
  proveedor_id: number = 9999999;

  articulos: Articulo[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;
  user: User;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];
  unidades: Unidad[] = [];
  bodegas: Bodega[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  ivas: Iva[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  constructor(
    public articuloService: ArticulosService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.articuloService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.closeSidebar();
    this.listar();
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
    this.articulos = [];
    let data = {
      buscar: this.buscar,
      categoria_id: this.categoria_id,
      impuesto: this.impuesto,
      sede_id: this.sede_id,
      bodega_id: this.bodega_id,
      segmento_cliente_id: this.segmento_cliente_id,
      unidad_id_bodegas: this.unidad_id_bodegas,
      proveedor_id: this.proveedor_id,
    };
    this.articuloService.listar(page, data).subscribe((resp) => {

      // Verifica si existe `resp.articulos.data` antes de procesar
      if (resp && resp.articulos && resp.articulos.data) {
        this.articulos = resp.articulos.data.map((articulo) => ({
          ...articulo,
          estado: Number(articulo.estado), // Convierte el estado a número
        }));

        this.totalPages = resp.total; // Asigna el total de páginas desde `resp.total`
        this.currentPage = page; // Página actual

      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
    });
  }

  resetList() {
    this.buscar = '';
    this.categoria_id = 9999999;
    this.impuesto = 9999999;
    this.sede_id = 9999999;
    this.bodega_id = 9999999;
    this.segmento_cliente_id = 9999999;
    this.unidad_id_bodegas = 9999999;
    this.proveedor_id = 9999999;
    this.listar();
  }

  cambiarEstado(articulo: Articulo) {
    const modalRef = this.modalService.open(DeleteArticuloComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.ArticuloSeleccionado = articulo;
    modalRef.componentInstance.ArticuloD.subscribe((ArticuloR: Articulo) => {
      let index = this.articulos.findIndex((articuloFind: Articulo) => articuloFind.id === articulo.id);
      if (index != -1) {
        this.articulos[index] = ArticuloR;
      }
    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.unidades = response.unidades;
        this.sedes = response.sedes;
        this.bodegas = response.bodegas;
        this.segmentos_clientes = response.segmentos_clientes;
        this.ivas = response.ivas;
        this.categorias = response.categorias;
        this.proveedores = response.proveedores;
      });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }

  download() {
    const params = {
      buscar: this.buscar, // Siempre incluir
      categoria_id: this.categoria_id,
      impuesto: this.impuesto,
      sede_id: this.sede_id,
      bodega_id: this.bodega_id,
      segmento_cliente_id: this.segmento_cliente_id,
      unidad_id_bodegas: this.unidad_id_bodegas,
      proveedor_id: this.proveedor_id,
      empresa_id: this.user.empresa_id
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => key === 'buscar' || (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-articulo' + link, '_BLANK');
  }

  import() {
    const modalRef = this.modalService.open(ImportArticuloComponent, { centered: true, size: 'md' });

    modalRef.componentInstance.ImportArticuloD.subscribe((ArticuloR: Articulo) => {
      this.listar();
    });
  }
}
