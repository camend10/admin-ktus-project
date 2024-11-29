import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Sede } from '../../sedes/interfaces';
import { MetodoPagoService } from '../service/metodo-pago.service';
import { CreateMetodoPagoComponent } from '../create-metodo-pago/create-metodo-pago.component';
import { EditMetodoPagoComponent } from '../edit-metodo-pago/edit-metodo-pago.component';
import { DeleteMetodoPagoComponent } from '../delete-metodo-pago/delete-metodo-pago.component';
import { MetodoPago } from '../interfaces/index';


@Component({
  selector: 'app-list-metodo-pagos',
  templateUrl: './list-metodo-pagos.component.html',
  styleUrl: './list-metodo-pagos.component.scss'
})
export class ListMetodoPagosComponent implements OnInit {

  buscar: string = '';
  metodoPagos: MetodoPago[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public metodoPagoService: MetodoPagoService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.metodoPagoService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.metodoPagoService.listar(page, this.buscar).subscribe((resp) => {
      this.metodoPagos = resp.metodoPagos;
      this.metodoPagos = this.metodoPagos.map(metodoPago => ({
        ...metodoPago,
        estado: Number(metodoPago.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateMetodoPagoComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    // modalRef.componentInstance.metodosPagos = this.metodoPagos.filter((metodo: MetodoPago) => !metodo.metodo_pago_id);
    modalRef.componentInstance.metodosPagos = this.metodoPagos.filter((metodo: MetodoPago) => !metodo.metodo_pago_id && metodo.metodo_pago_id !== 0);

    modalRef.componentInstance.MetodoPagoC.subscribe((metodoPago: MetodoPago) => {
      this.metodoPagos.unshift(metodoPago);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(metodoPago: MetodoPago) {
    const modalRef = this.modalService.open(EditMetodoPagoComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.metodosPagos = this.metodoPagos.filter((metodo: MetodoPago) => !metodo.metodo_pago_id && metodo.metodo_pago_id !== 0);
    modalRef.componentInstance.MetodoPagoSeleccionado = metodoPago;
    modalRef.componentInstance.MetodoPagoE.subscribe((MetodoPagoR: MetodoPago) => {
      let index = this.metodoPagos.findIndex((MetodoPagoFind: MetodoPago) => MetodoPagoFind.id === metodoPago.id);
      if (index != -1) {
        this.metodoPagos[index] = MetodoPagoR;
      }

    });
  }

  cambiarEstado(metodoPago: MetodoPago) {
    const modalRef = this.modalService.open(DeleteMetodoPagoComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.MetodoPagoSeleccionado = metodoPago;
    modalRef.componentInstance.MetodoPagoD.subscribe((MetodoPagoR: MetodoPago) => {
      let index = this.metodoPagos.findIndex((MetodoPagoFind: MetodoPago) => MetodoPagoFind.id === metodoPago.id);
      if (index != -1) {
        this.metodoPagos[index] = MetodoPagoR;
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
