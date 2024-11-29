import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { UsersService } from '../service/users.service';
import { User } from '../interfaces';
import { TipoDoc, Departamento, Municipio, Genero, Role, Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from '../../auth';
import { Sede } from '../../configuracion/sedes/interfaces';
import { isPermission } from 'src/app/config/config';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {

  buscar: string = '';
  usuarios: User[] = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  tipodocumentos: TipoDoc[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  generos: Genero[] = [];
  roles: Role[] = [];
  empresas: Empresa[] = [];
  sedes: Sede[] = [];

  user: User

  constructor(
    public modalService: NgbModal,
    public userService: UsersService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.userService.isLoading$;
    this.user = this.authService.user;
    // this.isLoading$ = this.generalService.isLoading$;

    // this.cargarTipoDocumentos();
    // this.cargarDepartamentos();
    // this.cargarMunicipios();
    // this.cargarGeneros();
    // this.cargarRoles();
    // this.cargarEmpresas();
    this.cargarConfiguraciones();
    this.listarUsuarios();
  }

  listarUsuarios(page = 1) {
    this.userService.listarUsuarios(page, this.buscar).subscribe((resp) => {
      this.usuarios = resp.users;
      this.usuarios = this.usuarios.map(user => ({
        ...user,
        estado: Number(user.estado),
        sedesFormatted: user.sedes ? user.sedes.map(sede => sede.nombre).join('<br>') : 'Sin sedes'
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  crearUsuario() {
    const modalRef = this.modalService.open(CreateUserComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.generos = this.generos;
    modalRef.componentInstance.roles = this.roles;
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.sedes = this.sedes;

    modalRef.componentInstance.UserC.subscribe((user: User) => {

      const sedesFormatted = user.sedes && user.sedes.length > 0
        ? user.sedes.map((sede: Sede) => sede.nombre).join('<br>')
        : 'Sin sedes';

      this.usuarios.unshift({
        ...user,
        estado: Number(user.estado), // Asegúrate de que el estado sea un número
        sedesFormatted, // Formatear las sedes para la tabla
      });
    });
  }

  loadPage($event: number) {
    this.listarUsuarios($event);
  }

  editarUsuario(user: User) {
    const modalRef = this.modalService.open(EditUserComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.tipodocumentos = this.tipodocumentos;
    modalRef.componentInstance.departamentos = this.departamentos;
    modalRef.componentInstance.municipios = this.municipios;
    modalRef.componentInstance.generos = this.generos;
    modalRef.componentInstance.roles = this.roles;
    modalRef.componentInstance.empresas = this.empresas;
    modalRef.componentInstance.UserSeleccionado = user;
    modalRef.componentInstance.sedes = this.sedes;
    modalRef.componentInstance.sedesUsuario = user.sedes ? user.sedes.map(sede => sede.id) : [];


    modalRef.componentInstance.UserE.subscribe((UserR: User) => {

      let index = this.usuarios.findIndex((userFind: User) => userFind.id === user.id);
      if (index != -1) {
        // this.usuarios[index] = UserR;

        this.usuarios[index] = {
          ...UserR,
          estado: Number(UserR.estado), // Asegura que el estado sea un número
          sedesFormatted: UserR.sedes && UserR.sedes.length > 0
            ? UserR.sedes.map((sede: Sede) => sede.nombre).join('<br>') // Une los nombres de las sedes
            : 'Sin sedes', // Si no hay sedes
        };
      }

    });
  }

  cambiarEstado(user: User) {
    const modalRef = this.modalService.open(DeleteUserComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.UserSeleccionado = user;
    modalRef.componentInstance.UserD.subscribe((UserR: User) => {
      let index = this.usuarios.findIndex((userFind: User) => userFind.id === user.id);
      if (index != -1) {
        this.usuarios[index] = UserR;
      }

    });
  }

  cargarTipoDocumentos() {
    this.generalService.cargarTipoDocumentos()
      .subscribe((response) => {
        this.tipodocumentos = response.tipodocumentos.map((doc) => ({
          ...doc,
          estado: Number(doc.estado) // Convierte "estado" a número si viene como cadena
        }));
      })
  }

  cargarDepartamentos() {
    this.generalService.cargarDepartamentos()
      .subscribe((response) => {
        this.departamentos = response.departamentos;
      })
  }

  cargarMunicipios() {
    this.generalService.cargarMunicipios()
      .subscribe((response) => {
        this.municipios = response.municipios;
      })
  }

  cargarGeneros() {
    this.generalService.cargarGeneros()
      .subscribe((response) => {
        this.generos = response.generos;
      })
  }

  cargarRoles() {
    this.generalService.cargarRoles()
      .subscribe((response) => {
        this.roles = response.roles;
      })
  }

  cargarEmpresas() {
    this.generalService.cargarEmpresas(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
      });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguraciones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.departamentos = response.departamentos;
        this.municipios = response.municipios;
        this.tipodocumentos = response.tipodocumentos;
        this.generos = response.generos;
        this.roles = response.roles;
        this.sedes = response.sedes;
      });
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
