import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearComponent } from '../crear/crear.component';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../interfaces';
import { Role } from '../models/role.model';
import { EditarComponent } from '../editar/editar.component';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { AuthService } from 'src/app/modules/auth';
import { User } from '../../users/interfaces';
import { isPermission } from 'src/app/config/config';
import { Permission } from '../models/permission.model';
import { VerPermisosComponent } from '../ver-permisos/ver-permisos.component';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.scss'
})
export class ListarComponent implements OnInit {

  buscar: string = '';
  roles: Roles[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  user: User

  constructor(
    public modalService: NgbModal,
    public rolesService: RolesService,
    public toast: ToastrService,
    public authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.user = this.authService.user;
    this.listarRoles();
  }

  crearRol() {
    const modalRef = this.modalService.open(CrearComponent, { centered: true, size: 'xl' });

    modalRef.componentInstance.RoleC.subscribe((role: Roles) => {
      this.roles.unshift(role);
    });
  }

  listarRoles(page = 1) {
    this.rolesService.listarRoles(page, this.buscar).subscribe((resp) => {
      this.roles = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  loadPage($event: number) {
    this.listarRoles($event);
  }

  editarRole(rol: Roles) {
    const modalRef = this.modalService.open(EditarComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.RoleSeleccionado = rol;
    modalRef.componentInstance.RoleE.subscribe((roleR: Roles) => {
      let index = this.roles.findIndex((rolFind: Roles) => rolFind.id === rol.id);
      if (index != -1) {
        this.roles[index] = roleR;
      }

    });
  }

  eliminarRole(rol: Roles) {
    const modalRef = this.modalService.open(EliminarComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.RoleSeleccionado = rol;
    modalRef.componentInstance.RoleD.subscribe((roleR: Roles) => {
      let index = this.roles.findIndex((rolFind: Roles) => rolFind.id === rol.id);
      if (index != -1) {
        this.roles.splice(index, 1);
      }

    });
  }

  verPermisos(permisos: string[]) {
    const modalRef = this.modalService.open(VerPermisosComponent, { centered: true, size: 'xl' });

    modalRef.componentInstance.permissions = permisos;
    modalRef.componentInstance.PermisoC.subscribe((permi: Permission) => {
    
    });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
