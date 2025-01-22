import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Municipio } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { SedeService } from '../service/sede.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { CreateSedeComponent } from '../create-sede/create-sede.component';
import { EditSedeComponent } from '../edit-sede/edit-sede.component';
import { DeleteSedeComponent } from '../delete-sede/delete-sede.component';
import { Sede } from '../interfaces';
import { isPermission } from 'src/app/config/config';


@Component({
  selector: 'app-list-sede',
  templateUrl: './list-sede.component.html',
  styleUrl: './list-sede.component.scss'
})
export class ListSedeComponent implements OnInit {
  buscar: string = '';
  sedes: Sede[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];

  user: User;
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];

  constructor(
    public modalService: NgbModal,
    public sedeService: SedeService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.sedeService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.sedeService.listar(page, this.buscar).subscribe((resp) => {
      this.sedes = resp.sedes;
      this.sedes = this.sedes.map(sede => ({
        ...sede,
        estado: Number(sede.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateSedeComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.SedeC.subscribe((sede: Sede) => {
      this.sedes.unshift(sede);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(sede: Sede) {
    const modalRef = this.modalService.open(EditSedeComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.SedeSeleccionado = sede;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.SedeE.subscribe((SedeR: Sede) => {
      let index = this.sedes.findIndex((sedeFind: Sede) => sedeFind.id === sede.id);
      if (index != -1) {
        this.sedes[index] = SedeR;
      }

    });
  }

  cambiarEstado(sede: Sede) {
    const modalRef = this.modalService.open(DeleteSedeComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SedeSeleccionado = sede;
    modalRef.componentInstance.SedeD.subscribe((SedeR: Sede) => {
      let index = this.sedes.findIndex((sedeFind: Sede) => sedeFind.id === sede.id);
      if (index != -1) {
        this.sedes[index] = SedeR;
      }

    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresasActivas;
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
