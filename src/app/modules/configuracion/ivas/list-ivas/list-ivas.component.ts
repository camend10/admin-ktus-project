import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Iva } from '../interfaces';
import { IvaService } from '../service/iva.service';
import { CreateIvaComponent } from '../create-iva/create-iva.component';
import { EditIvaComponent } from '../edit-iva/edit-iva.component';
import { DeleteIvaComponent } from '../delete-iva/delete-iva.component';


@Component({
  selector: 'app-list-ivas',
  templateUrl: './list-ivas.component.html',
  styleUrl: './list-ivas.component.scss'
})
export class ListIvasComponent implements OnInit {

  buscar: string = '';
  ivas: Iva[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public ivaService: IvaService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.ivaService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.ivaService.listar(page, this.buscar).subscribe((resp) => {
      this.ivas = resp.ivas;
      this.ivas = this.ivas.map(iva => ({
        ...iva,
        estado: Number(iva.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateIvaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;

    modalRef.componentInstance.IvaC.subscribe((iva: Iva) => {
      this.ivas.unshift(iva);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(iva: Iva) {
    const modalRef = this.modalService.open(EditIvaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.IvaSeleccionado = iva;
    modalRef.componentInstance.IvaE.subscribe((IvaR: Iva) => {
      let index = this.ivas.findIndex((IvaFind: Iva) => IvaFind.id === iva.id);
      if (index != -1) {
        this.ivas[index] = IvaR;
      }
    });
  }

  cambiarEstado(iva: Iva) {
    const modalRef = this.modalService.open(DeleteIvaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.IvaSeleccionado = iva;
    modalRef.componentInstance.IvaD.subscribe((IvaR: Iva) => {
      let index = this.ivas.findIndex((IvaFind: Iva) => IvaFind.id === iva.id);
      if (index != -1) {
        this.ivas[index] = IvaR;
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
