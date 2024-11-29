import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { SegmentoCliente } from '../interfaces';
import { SegmentoClienteService } from '../service/segmento-cliente.service';
import { CreateSegmentoClienteComponent } from '../create-segmento-cliente/create-segmento-cliente.component';
import { EditSegmentoClienteComponent } from '../edit-segmento-cliente/edit-segmento-cliente.component';
import { DeleteSegmentoClienteComponent } from '../delete-segmento-cliente/delete-segmento-cliente.component';


@Component({
  selector: 'app-list-segmento-clientes',
  templateUrl: './list-segmento-clientes.component.html',
  styleUrl: './list-segmento-clientes.component.scss'
})
export class ListSegmentoClientesComponent implements OnInit {

  buscar: string = '';
  segmentoClientes: SegmentoCliente[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public segmentoClienteService: SegmentoClienteService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.segmentoClienteService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.segmentoClienteService.listar(page, this.buscar).subscribe((resp) => {
      this.segmentoClientes = resp.segmentoClientes;
      this.segmentoClientes = this.segmentoClientes.map(segmentoCliente => ({
        ...segmentoCliente,
        estado: Number(segmentoCliente.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateSegmentoClienteComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.segmentoClientes = this.segmentoClientes;

    modalRef.componentInstance.SegmentoClienteC.subscribe((segmentoCliente: SegmentoCliente) => {
      this.segmentoClientes.unshift(segmentoCliente);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(segmentoCliente: SegmentoCliente) {
    const modalRef = this.modalService.open(EditSegmentoClienteComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.SegmentoClienteSeleccionado = segmentoCliente;
    modalRef.componentInstance.SegmentoClienteE.subscribe((SegmentoClienteR: SegmentoCliente) => {
      let index = this.segmentoClientes.findIndex((SegmentoClienteFind: SegmentoCliente) => SegmentoClienteFind.id === segmentoCliente.id);
      if (index != -1) {
        this.segmentoClientes[index] = SegmentoClienteR;
      }

    });
  }

  cambiarEstado(segmentoCliente: SegmentoCliente) {
    const modalRef = this.modalService.open(DeleteSegmentoClienteComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SegmentoClienteSeleccionado = segmentoCliente;
    modalRef.componentInstance.SegmentoClienteD.subscribe((SegmentoClienteR: SegmentoCliente) => {
      let index = this.segmentoClientes.findIndex((SegmentoClienteFind: SegmentoCliente) => SegmentoClienteFind.id === segmentoCliente.id);
      if (index != -1) {
        this.segmentoClientes[index] = SegmentoClienteR;
      }
    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }

}
