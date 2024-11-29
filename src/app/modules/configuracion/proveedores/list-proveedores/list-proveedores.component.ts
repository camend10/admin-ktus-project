import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Municipio, TipoDoc } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Proveedor } from '../interfaces';
import { ProveedorService } from '../service/proveedor.service';
import { CreateProveedorComponent } from '../create-proveedor/create-proveedor.component';
import { EditProveedorComponent } from '../edit-proveedor/edit-proveedor.component';
import { DeleteProveedorComponent } from '../delete-proveedor/delete-proveedor.component';

@Component({
  selector: 'app-list-proveedores',
  templateUrl: './list-proveedores.component.html',
  styleUrl: './list-proveedores.component.scss'
})
export class ListProveedoresComponent implements OnInit {

  buscar: string = '';
  proveedores: Proveedor[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  tipodocumentos: TipoDoc[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public proveedorService: ProveedorService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.proveedorService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.proveedorService.listar(page, this.buscar).subscribe((resp) => {
      this.proveedores = resp.proveedores;
      this.proveedores = this.proveedores.map(proveedor => ({
        ...proveedor,
        estado: Number(proveedor.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateProveedorComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;

    modalRef.componentInstance.ProveedorC.subscribe((proveedor: Proveedor) => {

      this.proveedores.unshift({
        ...proveedor,
        estado: Number(proveedor.estado)
      });
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(proveedor: Proveedor) {
    const modalRef = this.modalService.open(EditProveedorComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;
    modalRef.componentInstance.ProveedorSeleccionado = proveedor;
    modalRef.componentInstance.ProveedorE.subscribe((ProveedorR: Proveedor) => {
      let index = this.proveedores.findIndex((ProveedorFind: Proveedor) => ProveedorFind.id === proveedor.id);
      if (index != -1) {
        this.proveedores[index] = {
          ...ProveedorR,
          estado: Number(ProveedorR.estado)
        };
      }
    });
  }

  cambiarEstado(proveedor: Proveedor) {
    const modalRef = this.modalService.open(DeleteProveedorComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.ProveedorSeleccionado = proveedor;
    modalRef.componentInstance.ProveedorD.subscribe((ProveedorR: Proveedor) => {
      let index = this.proveedores.findIndex((ProveedorFind: Proveedor) => ProveedorFind.id === proveedor.id);
      if (index != -1) {
        this.proveedores[index] = ProveedorR;
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
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }

}
