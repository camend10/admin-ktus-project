import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { ReportesService } from '../service/reportes.service';
import { User } from '../../users/interfaces';
import { Articulo } from '../../articulos/interfaces';
import { Empresa } from 'src/app/interfaces';
import { Sede } from '../../configuracion/sedes/interfaces';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Categoria } from '../../configuracion/categorias/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-baja-existencia',
  templateUrl: './baja-existencia.component.html',
  styleUrl: './baja-existencia.component.scss'
})
export class BajaExistenciaComponent implements OnInit, OnDestroy {

  isLoading$: Observable<boolean>;
  totalPages: number = 0;
  currentPage: number = 1;
  user: User;
  articulos: Articulo[] = [];

  buscar: string = '';
  categoria_id: number = 9999999;
  sede_id: number = 9999999;
  bodega_id: number = 9999999;
  unidad_id_bodegas: number = 9999999;
  proveedor_id: number = 9999999;
  state_stock: number = 9999999;
  num_art_agotados: number = 0;
  num_art_por_agotar: number = 0;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];
  unidades: Unidad[] = [];
  bodegas: Bodega[] = [];
  bodegasFiltradas: Bodega[] = [];
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

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.unidades = response.unidades;
        this.sedes = response.sedes;
        this.bodegas = response.bodegas;
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

  listar(page = 1) {
    this.articulos = [];

    let data = {
      buscar: this.buscar,
      categoria_id: this.categoria_id,
      sede_id: this.sede_id,
      bodega_id: this.bodega_id,
      unidad_id_bodegas: this.unidad_id_bodegas,
      proveedor_id: this.proveedor_id,
      state_stock: this.state_stock,
    };

    this.reporteService.baja_existencia(page, data).subscribe((resp) => {

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

  resetList() {
    this.buscar = '';
    this.categoria_id = 9999999;
    this.sede_id = 9999999;
    this.bodega_id = 9999999;
    this.unidad_id_bodegas = 9999999;
    this.proveedor_id = 9999999;
    this.state_stock = 9999999;
    this.listar();
  }

  download() {

    // let sedeId = this.sede_id === 9999999
    //   ? (this.user?.sede_id ?? 0) // Si this.user.sede_id no está definido, usa 0
    //   : (this.sede_id ?? 0); // Si this.sede_id no está definido, usa 0

    const params = {
      buscar: this.buscar, // Siempre incluir
      categoria_id: this.categoria_id,
      sede_id: this.sede_id,
      bodega_id: this.bodega_id,
      unidad_id_bodegas: this.unidad_id_bodegas,
      proveedor_id: this.proveedor_id,
      empresa_id: this.user.empresa_id,
      state_stock: this.state_stock,
      sede_usuario_id: this.user.sede_id,
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => key === 'buscar' || (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-articulo-baja-existencia' + link, '_BLANK');
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

  loadPage($event: number) {
    this.listar($event);
  }
}
