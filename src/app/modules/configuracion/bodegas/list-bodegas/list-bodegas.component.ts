import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Municipio } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Bodega } from '../interfaces';
import { Sede } from '../../sedes/interfaces';
import { BodegaService } from '../service/bodega.service';
import { CreateBodegaComponent } from '../create-bodega/create-bodega.component';
import { EditBodegaComponent } from '../edit-bodega/edit-bodega.component';
import { DeleteBodegaComponent } from '../delete-bodega/delete-bodega.component';

@Component({
  selector: 'app-list-bodegas',
  templateUrl: './list-bodegas.component.html',
  styleUrl: './list-bodegas.component.scss'
})
export class ListBodegasComponent implements OnInit {

  buscar: string = '';
  bodegas: Bodega[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];
  sedes: Sede[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public bodegaService: BodegaService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.bodegaService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.bodegaService.listar(page, this.buscar).subscribe((resp) => {
      this.bodegas = resp.bodegas;
      this.bodegas = this.bodegas.map(bodega => ({
        ...bodega,
        estado: Number(bodega.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateBodegaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.sedes = this.sedes;

    modalRef.componentInstance.BodegaC.subscribe((bodega: Bodega) => {
      this.bodegas.unshift(bodega);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(bodega: Bodega) {
    const modalRef = this.modalService.open(EditBodegaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.sedes = this.sedes;
    modalRef.componentInstance.BodegaSeleccionado = bodega;
    modalRef.componentInstance.BodegaE.subscribe((BodegaR: Bodega) => {
      let index = this.bodegas.findIndex((BodegaFind: Bodega) => BodegaFind.id === bodega.id);
      if (index != -1) {
        this.bodegas[index] = BodegaR;
      }

    });
  }

  cambiarEstado(bodega: Bodega) {
    const modalRef = this.modalService.open(DeleteBodegaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.BodegaSeleccionado = bodega;
    modalRef.componentInstance.BodegaD.subscribe((BodegaR: Bodega) => {
      let index = this.bodegas.findIndex((BodegaFind: Bodega) => BodegaFind.id === bodega.id);
      if (index != -1) {
        this.bodegas[index] = BodegaR;
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
