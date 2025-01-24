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
  state_stock: number = 9999999;
  num_art_agotados: number = 0;
  num_art_por_agotar: number = 0;

  articulos: Articulo[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;
  user: User;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];
  unidades: Unidad[] = [];
  bodegas: Bodega[] = [];
  bodegasFiltradas: Bodega[] = [];
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
      state_stock: this.state_stock,
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
        this.num_art_agotados = resp.num_art_agotados;
        this.num_art_por_agotar = resp.num_art_por_agotar;
      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
    });
  }

  getCantidadUnidadYSede(item: Articulo): { cantidad: number; unidad: string; sede: string } {
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

  resetList() {
    this.buscar = '';
    this.categoria_id = 9999999;
    this.impuesto = 9999999;
    this.sede_id = 9999999;
    this.bodega_id = 9999999;
    this.segmento_cliente_id = 9999999;
    this.unidad_id_bodegas = 9999999;
    this.proveedor_id = 9999999;
    this.state_stock = 9999999;
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

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });

        this.proveedores = this.proveedores.map(proveedor => {
          return {
            ...proveedor, nombre: this.capitalize(proveedor.nombres),
            apellidos: proveedor.apellidos === null ? this.capitalize(proveedor.apellidos) : ''
          };
        });

        this.unidades = this.unidades.map(unidad => {
          return { ...unidad, nombre: this.capitalize(unidad.nombre) };
        });

        this.segmentos_clientes = this.segmentos_clientes.map(segmento => {
          return { ...segmento, nombre: this.capitalize(segmento.nombre) };
        });

        this.categorias = this.categorias.map(categoria => {
          return { ...categoria, nombre: this.capitalize(categoria.nombre) };
        });

      });
  }

  changeSede() {
    if (this.sede_id !== 9999999) {
      // Filtra las bodegas según el sede_id seleccionado
      const bodegasFiltradas = this.bodegas.filter((bodega) => Number(bodega.sede_id) === Number(this.sede_id));
      this.bodegasFiltradas = bodegasFiltradas;
    } else {
      this.bodegasFiltradas = this.bodegas;
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
      empresa_id: this.user.empresa_id,
      state_stock: this.state_stock,
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

  selectAgotado() {
    this.state_stock = 3;
    this.listar();
  }

  selectPorAgotar() {
    this.state_stock = 2;
    this.listar();
  }
}
