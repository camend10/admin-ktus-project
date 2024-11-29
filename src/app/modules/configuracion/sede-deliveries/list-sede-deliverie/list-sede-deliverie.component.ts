import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Sede } from '../../sedes/interfaces';
import { SedeDeliverie } from '../interfaces';
import { SedeDeliverieService } from '../service/sede-deliverie.service';
import { CreateSedeDeliverieComponent } from '../create-sede-deliverie/create-sede-deliverie.component';
import { EditSedeDeliverieComponent } from '../edit-sede-deliverie/edit-sede-deliverie.component';
import { DeleteSedeDeliverieComponent } from '../delete-sede-deliverie/delete-sede-deliverie.component';


@Component({
  selector: 'app-list-sede-deliverie',
  templateUrl: './list-sede-deliverie.component.html',
  styleUrl: './list-sede-deliverie.component.scss'
})
export class ListSedeDeliverieComponent implements OnInit {
  buscar: string = '';
  sedeDeliveries: SedeDeliverie[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public sedeDeliverieService: SedeDeliverieService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.sedeDeliverieService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.sedeDeliverieService.listar(page, this.buscar).subscribe((resp) => {
      this.sedeDeliveries = resp.sedeDeliveries;
      this.sedeDeliveries = this.sedeDeliveries.map(sedeDeliverie => ({
        ...sedeDeliverie,
        estado: Number(sedeDeliverie.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateSedeDeliverieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.sedes = this.sedes;

    modalRef.componentInstance.SedeDeliverieC.subscribe((sedeDeliverie: SedeDeliverie) => {
      this.sedeDeliveries.unshift(sedeDeliverie);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(sedeDeliverie: SedeDeliverie) {
    const modalRef = this.modalService.open(EditSedeDeliverieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.sedes = this.sedes;
    modalRef.componentInstance.SedeDeliverieSeleccionado = sedeDeliverie;
    modalRef.componentInstance.SedeDeliverieE.subscribe((SedeDeliverieR: SedeDeliverie) => {
      let index = this.sedeDeliveries.findIndex((SedeDeliverieFind: SedeDeliverie) => SedeDeliverieFind.id === sedeDeliverie.id);
      if (index != -1) {
        this.sedeDeliveries[index] = SedeDeliverieR;
      }

    });
  }

  cambiarEstado(sedeDeliverie: SedeDeliverie) {
    const modalRef = this.modalService.open(DeleteSedeDeliverieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SedeDeliverieSeleccionado = sedeDeliverie;
    modalRef.componentInstance.SedeDeliverieD.subscribe((SedeDeliverieR: SedeDeliverie) => {
      let index = this.sedeDeliveries.findIndex((SedeDeliverieFind: SedeDeliverie) => SedeDeliverieFind.id === sedeDeliverie.id);
      if (index != -1) {
        this.sedeDeliveries[index] = SedeDeliverieR;
      }

    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.sedes = response.arraySedes;
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
