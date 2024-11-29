import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Unidad } from '../interfaces';
import { UnidadesService } from '../service/unidades.service';
import { CreateUnidadComponent } from '../create-unidad/create-unidad.component';
import { EditUnidadComponent } from '../edit-unidad/edit-unidad.component';
import { DeleteUnidadComponent } from '../delete-unidad/delete-unidad.component';
import { CreateTransformacionComponent } from '../create-transformacion/create-transformacion.component';


@Component({
  selector: 'app-list-unidades',
  templateUrl: './list-unidades.component.html',
  styleUrl: './list-unidades.component.scss'
})
export class ListUnidadesComponent implements OnInit {

  buscar: string = '';
  unidades: Unidad[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public unidadesService: UnidadesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.unidadesService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {
    this.unidadesService.listar(page, this.buscar).subscribe((resp) => {
      this.unidades = resp.unidades;
      this.unidades = this.unidades.map(unidad => ({
        ...unidad,
        estado: Number(unidad.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crear() {
    const modalRef = this.modalService.open(CreateUnidadComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;

    modalRef.componentInstance.UnidadC.subscribe((unidad: Unidad) => {
      this.unidades.unshift(unidad);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  editar(unidad: Unidad) {
    const modalRef = this.modalService.open(EditUnidadComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.UnidadSeleccionado = unidad;
    modalRef.componentInstance.UnidadE.subscribe((UnidadR: Unidad) => {
      let index = this.unidades.findIndex((UnidadFind: Unidad) => UnidadFind.id === unidad.id);
      if (index != -1) {
        this.unidades[index] = UnidadR;
      }
    });
  }

  cambiarEstado(unidad: Unidad) {
    const modalRef = this.modalService.open(DeleteUnidadComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.UnidadSeleccionado = unidad;
    modalRef.componentInstance.UnidadD.subscribe((UnidadR: Unidad) => {
      let index = this.unidades.findIndex((UnidadFind: Unidad) => UnidadFind.id === unidad.id);
      if (index != -1) {
        this.unidades[index] = UnidadR;
      }
    });
  }

  addTransformacion(unidad: Unidad) {
    const modalRef = this.modalService.open(CreateTransformacionComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.unidadTransformacionSeleccionado = unidad;
    modalRef.componentInstance.unidades = this.unidades.filter((uni: Unidad) => uni.id != unidad.id);
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
