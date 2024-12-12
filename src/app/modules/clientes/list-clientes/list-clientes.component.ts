import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission, URL_SERVICIOS } from 'src/app/config/config';
import { Cliente } from '../interfaces';
import { ClientesService } from '../service/clientes.service';
import { CreateClienteComponent } from '../create-cliente/create-cliente.component';
import { EditClienteComponent } from '../edit-cliente/edit-cliente.component';
import { DeleteClienteComponent } from '../delete-cliente/delete-cliente.component';
import { Sede } from '../../configuracion/sedes/interfaces';
import { SegmentoCliente } from '../../configuracion/segmento-clientes/interfaces';
import { ImportClienteComponent } from '../import-cliente/import-cliente.component';

@Component({
  selector: 'app-list-clientes',
  templateUrl: './list-clientes.component.html',
  styleUrl: './list-clientes.component.scss'
})
export class ListClientesComponent implements OnInit, OnDestroy {

  buscar: string = '';
  clientes: Cliente[] = [];
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

  user: User;

  segmento_cliente_id: number = 9999999;
  tipo: number = 9999999;

  constructor(
    public modalService: NgbModal,
    public clienteService: ClientesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.clienteService.isLoading$;
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
    this.clientes = [];

    let data = {
      buscar: this.buscar,
      segmento_cliente_id: this.segmento_cliente_id,
      tipo: this.tipo
    };

    this.clienteService.listar(page, data).subscribe((resp) => {

      if (resp && resp.clientes && resp.clientes.data) {
        this.clientes = resp.clientes.data.map((cliente) => ({
          ...cliente,
          estado: Number(cliente.estado), // Convierte el estado a número
        }));

        this.totalPages = resp.total; // Asigna el total de páginas desde `resp.total`
        this.currentPage = page; // Página actual

      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateClienteComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;
    modalRef.componentInstance.sedes = this.sedes;
    modalRef.componentInstance.segmentos = this.segmentos;
    modalRef.componentInstance.generos = this.generos;

    modalRef.componentInstance.ClienteC.subscribe((cliente: Cliente) => {

      this.clientes.unshift({
        ...cliente,
        estado: Number(cliente.estado)
      });
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(cliente: Cliente) {
    const modalRef = this.modalService.open(EditClienteComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;
    modalRef.componentInstance.ClienteSeleccionado = cliente;
    modalRef.componentInstance.sedes = this.sedes;
    modalRef.componentInstance.segmentos = this.segmentos;
    modalRef.componentInstance.generos = this.generos;

    modalRef.componentInstance.ClienteE.subscribe((ClienteR: Cliente) => {
      let index = this.clientes.findIndex((ClienteFind: Cliente) => ClienteFind.id === cliente.id);
      if (index != -1) {
        this.clientes[index] = {
          ...ClienteR,
          estado: Number(ClienteR.estado)
        };
      }
    });
  }

  cambiarEstado(cliente: Cliente) {
    const modalRef = this.modalService.open(DeleteClienteComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.ClienteSeleccionado = cliente;
    modalRef.componentInstance.ClienteD.subscribe((ClienteR: Cliente) => {
      let index = this.clientes.findIndex((ClienteFind: Cliente) => ClienteFind.id === cliente.id);
      if (index != -1) {
        this.clientes[index] = ClienteR;
      }
    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.tipodocumentos = response.tipodocumentos.filter((doc: TipoDoc) => doc.id === 1 || doc.id === 6);
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
        this.sedes = response.sedes;
        this.segmentos = response.segmentos_clientes;
        this.generos = response.generos;
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

  import() {
    const modalRef = this.modalService.open(ImportClienteComponent, { centered: true, size: 'md' });

    modalRef.componentInstance.ImportClienteD.subscribe((ClienteR: Cliente) => {
      this.listar();
    });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
