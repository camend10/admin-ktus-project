import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Departamento, Empresa, Genero, Municipio, TipoDoc } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission, URL_SERVICIOS } from 'src/app/config/config';
import { Sede } from '../../configuracion/sedes/interfaces';
import { Observable } from 'rxjs';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Proveedor } from '../../configuracion/proveedores/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';
import { Plantilla } from '../interfaces';
import { PlantillasService } from '../service/plantillas.service';
import { DeletePlantillaComponent } from '../delete-plantilla/delete-plantilla.component';




@Component({
  selector: 'app-list-plantillas',
  templateUrl: './list-plantillas.component.html',
  styleUrl: './list-plantillas.component.scss'
})
export class ListPlantillasComponent implements OnInit, OnDestroy {
  plantillas: Plantilla[] = [];
  isLoading$: Observable<boolean>;

  totalPages: number = 0;
  currentPage: number = 1;

  user: User;

  buscar: string = '';

  constructor(
    public modalService: NgbModal,
    public plantillaService: PlantillasService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.plantillaService.isLoading$;
    this.user = this.authService.user;

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
    this.plantillaService.listar(page, this.buscar).subscribe((resp) => {
      this.plantillas = resp.plantillas;
      this.plantillas = this.plantillas.map(plantilla => ({
        ...plantilla,
        estado: Number(plantilla.estado)
      }));
      this.totalPages = resp.total;
      this.currentPage = page;
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  cambiarEstado(plantilla: Plantilla) {
    const modalRef = this.modalService.open(DeletePlantillaComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.PlantillaSeleccionado = plantilla;
    modalRef.componentInstance.PlantillaD.subscribe((PlantillaR: Plantilla) => {
      let index = this.plantillas.findIndex((PlantillaFind: Plantilla) => PlantillaFind.id === plantilla.id);
      if (index != -1) {
        this.plantillas[index] = PlantillaR;
      }
    });
  }

  formatMovimientoId(id: number): string {
    return `SOL-${id.toString().padStart(6, '0')}`;
  }

  capitalize(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  isPermission(permission: string) {
    return isPermission(permission);
  }
}
