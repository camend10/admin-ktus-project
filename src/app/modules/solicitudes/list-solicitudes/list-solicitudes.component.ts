import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission, URL_SERVICIOS, isSuperAdmin } from 'src/app/config/config';
import { Sede } from '../../configuracion/sedes/interfaces';
import { Movimiento } from '../interfaces';
import { Observable } from 'rxjs';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { SolicitudesService } from '../service/solicitudes.service';
import { DeleteSolicitudComponent } from '../delete-solicitud/delete-solicitud.component';


@Component({
  selector: 'app-list-solicitudes',
  templateUrl: './list-solicitudes.component.html',
  styleUrl: './list-solicitudes.component.scss'
})
export class ListSolicitudesComponent implements OnInit, OnDestroy {

  isSuperAdmin = isSuperAdmin;

  movimientos: Movimiento[] = [];
  isLoading$: Observable<boolean>;

  totalPages: number = 0;
  currentPage: number = 1;

  bodegas: Bodega[] = [];
  bodegasFiltradas: Bodega[] = [];
  proveedores: Proveedor[] = [];
  sedes: Sede[] = [];
  usuarios: User[] = [];

  user: User;

  buscar: string = '';
  bodega_id: number = 9999999;
  sede_id: number = 9999999;
  usuario_id: number = 9999999;
  proveedor_id: number = 9999999;

  fecha_inicio: string = '';
  fecha_final: string = '';
  articulo: string = '';

  constructor(
    public modalService: NgbModal,
    public solicitudService: SolicitudesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.solicitudService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.closeSidebar();
    this.listar();
  }

  ngOnDestroy(): void {
    // Quitar el atributo cuando el componente se destruye
    document.body.removeAttribute('data-kt-app-sidebar-minimize');
  }

  closeSidebar() {
    const bodyTag = document.body;
    bodyTag.setAttribute('data-kt-app-sidebar-minimize', 'on');
  }

  listar(page = 1) {
    this.movimientos = [];

    let data = {
      buscar: this.buscar,
      bodega_id: this.bodega_id,
      usuario_id: this.usuario_id,
      proveedor_id: this.proveedor_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      articulo: this.articulo,
      sede_id: this.sede_id
    };

    this.solicitudService.listar(page, data).subscribe((resp) => {

      if (resp && resp.solicitudes && resp.solicitudes.data) {
        this.movimientos = resp.solicitudes.data.map((movimiento) => ({
          ...movimiento,
          estado: Number(movimiento.estado), // Convierte el estado a número
        }));

        this.totalPages = resp.total; // Asigna el total de páginas desde `resp.total`
        this.currentPage = page; // Página actual

      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  cambiarEstado(movimiento: Movimiento) {
    const modalRef = this.modalService.open(DeleteSolicitudComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.MovimientoSeleccionado = movimiento;
    modalRef.componentInstance.MovimientoD.subscribe((MovimientoR: Movimiento) => {
      let index = this.movimientos.findIndex((MovimientoFind: Movimiento) => MovimientoFind.id === movimiento.id);
      if (index != -1) {
        this.movimientos[index] = MovimientoR;
      }
    });
  }

  formatMovimientoId(id: number): string {
    return `SOL-${id.toString().padStart(6, '0')}`;
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesArticulos(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.bodegas = response.bodegas;
        this.proveedores = response.proveedores;
        this.sedes = response.sedes;
        this.usuarios = response.vendedores;
        // this.isLoadingProcess();

        this.usuarios = this.usuarios.map(usuario => {
          return { ...usuario, name: this.capitalize(usuario.name) };
        });

        this.sedes = this.sedes.map(sede => {
          return { ...sede, nombre: this.capitalize(sede.nombre) };
        });

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });

        this.proveedores = this.proveedores.map(proveedor => {
          return {
            ...proveedor, nombre: this.capitalize(proveedor.nombres),
            apellidos: proveedor.apellidos === null ? this.capitalize(proveedor.apellidos) : ''
          };
        });
      });
  }

  capitalize(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onFechaInicioChange(): void {
    // Si la fecha final es menor que la fecha inicial, actualiza la fecha final
    if (this.fecha_final < this.fecha_inicio) {
      this.fecha_final = this.fecha_inicio;
    }
  }

  onFechaFinalChange(): void {
    // Si la fecha inicial es mayor que la fecha final, actualiza la fecha inicial
    if (this.fecha_inicio > this.fecha_final) {
      this.fecha_inicio = this.fecha_final;
    }
  }

  resetList() {
    this.buscar = '';
    this.bodega_id = 9999999;
    this.sede_id = 9999999;
    this.usuario_id = 9999999;
    this.proveedor_id = 9999999;
    this.fecha_inicio = '';
    this.fecha_final = '';
    this.articulo = '';
    this.listar();
  }

  getBadgeClass(estado: number): string {
    switch (estado) {
      case 0:
        return 'badge badge-danger fs-7 fw-bold'; // Eliminado
      case 1:
        return 'badge badge-warning fs-7 fw-bold'; // Pendiente
      case 2:
        return 'badge badge-primary fs-7 fw-bold'; // Revision
      case 3:
        return 'badge badge-info fs-7 fw-bold'; // Parcial
      case 4:
        return 'badge badge-success fs-7 fw-bold'; // Verde
      default:
        return 'badge badge-secondary fs-7 fw-bold'; // Gris (DESCONOCIDO)
    }
  }

  getEstadoText(estado: number): string {
    switch (estado) {
      case 0:
        return 'ELIMINADO';
      case 1:
        return 'PENDIENTE';
      case 2:
        return 'REVISIÓN';
      case 3:
        return 'PARCIAL';
      case 4:
        return 'APROBADO';
      default:
        return 'DESCONOCIDO';
    }
  }

  changeSede() {
    if (this.sede_id !== 9999999) {
      // Filtra las bodegas según el sede_id seleccionado
      const bodegasFiltradas = this.bodegas.filter((bodega) => Number(bodega.sede_id) === Number(this.sede_id));
      this.bodegasFiltradas = bodegasFiltradas;
    } else {
      this.bodegasFiltradas = this.bodegas;
    }
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
