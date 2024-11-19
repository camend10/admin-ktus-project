import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';

import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { Empresa } from '../interfaces';
import { EmpresaService } from '../service/empresa.service';
import { CreateEmpresaComponent } from '../create-empresa/create-empresa.component';
import { EditEmpresaComponent } from '../edit-empresa/edit-empresa.component';
import { DeleteEmpresaComponent } from '../delete-empresa/delete-empresa.component';
import { isPermission } from 'src/app/config/config';
import { Departamento, Municipio } from 'src/app/interfaces';



@Component({
  selector: 'app-list-empresa',
  templateUrl: './list-empresa.component.html',
  styleUrl: './list-empresa.component.scss'
})
export class ListEmpresaComponent implements OnInit{
  buscar: string = '';
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;
  empresas: Empresa[] = [];
  user: User;

  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];

  constructor(
    public modalService: NgbModal,
    public empresaService: EmpresaService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.empresaService.isLoading$;
    this.user = this.authService.user;
    this.listar();
    this.cargarConfiguraciones();
  }

  listar(page = 1) {
    this.empresaService.listar(page, this.buscar).subscribe((resp) => {
      this.empresas = resp.empresas;
      this.empresas = this.empresas.map(empresa => ({
        ...empresa,
        estado: Number(empresa.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateEmpresaComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.EmpresaC.subscribe((empresa: Empresa) => {
      this.empresas.unshift(empresa);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(empresa: Empresa) {
    const modalRef = this.modalService.open(EditEmpresaComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.EmpresaSeleccionado = empresa;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.EmpresaE.subscribe((EmpresaR: Empresa) => {
      let index = this.empresas.findIndex((empresaFind: Empresa) => empresaFind.id === empresa.id);
      if (index != -1) {
        this.empresas[index] = EmpresaR;
      }

    });
  }

  cambiarEstado(empresa: Empresa) {
    const modalRef = this.modalService.open(DeleteEmpresaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.EmpresaSeleccionado = empresa;
    modalRef.componentInstance.EmpresaD.subscribe((EmpresaR: Empresa) => {
      let index = this.empresas.findIndex((empresaFind: Empresa) => empresaFind.id === empresa.id);
      if (index != -1) {
        this.empresas[index] = EmpresaR;
      }

    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
