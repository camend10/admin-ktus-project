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
  segmentos: SegmentoCliente[] = [];
  generos: Genero[] = [];
  segmentos_clientes: SegmentoCliente[] = [];
  sede_deliveries: SedeDeliverie[] = [];
  metodos_pagos: MetodoPago[] = [];

  user: User;

  segmento_cliente_id: number = 9999999;
  tipo: number = 9999999;

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
    this.facturas = [];

    let data = {
      buscar: this.buscar,
      segmento_cliente_id: this.segmento_cliente_id,
      tipo: this.tipo
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
        // this.isLoadingProcess();
      });
  }

  resetList() {
    this.buscar = '';
    this.segmento_cliente_id = 9999999;
    this.tipo = 9999999;
    this.listar();
  }

  download() {
    const params = {
      buscar: this.buscar,
      segmento_cliente_id: this.segmento_cliente_id,
      tipo: this.tipo,
      empresa_id: this.user.empresa_id,
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía
    const queryString = Object.entries(params)
      .filter(([key, value]) => key === 'buscar' || (value !== undefined && value !== null && value !== ''))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    window.open(URL_SERVICIOS + '/excel/export-clientes' + link, '_BLANK');
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
