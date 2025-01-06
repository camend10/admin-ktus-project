import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/interfaces';
import { GeneralesService } from 'src/app/services/generales.service';
import { AuthService } from 'src/app/modules/auth';
import { User } from 'src/app/modules/users/interfaces';
import { isPermission } from 'src/app/config/config';
import { ConversionesService } from '../service/conversiones.service';
import { Conversion } from '../interfaces';
import { CreateConversionComponent } from '../create-conversion/create-conversion.component';
import { DeleteConversionComponent } from '../delete-conversion/delete-conversion.component';
import { Bodega } from '../../configuracion/bodegas/interfaces';
import { Unidad } from '../../configuracion/unidades/interfaces';

@Component({
  selector: 'app-list-conversiones',
  templateUrl: './list-conversiones.component.html',
  styleUrl: './list-conversiones.component.scss'
})
export class ListConversionesComponent implements OnInit {
  buscar: string = '';
  conversiones: Conversion[] = [];
  // conversion_id: number = 9999999;
  bodega_id: number = 9999999;
  unidad_inicio_id: number = 9999999;
  unidad_final_id: number = 9999999;
  fecha_inicio: string = '';
  fecha_final: string = '';
  articulo: string = '';
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;

  empresas: Empresa[] = [];
  bodegas: Bodega[] = [];
  unidades: Unidad[] = [];

  user: User;

  constructor(
    public modalService: NgbModal,
    public conversionService: ConversionesService,
    public authService: AuthService,
    public toast: ToastrService,
    public generalService: GeneralesService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.conversionService.isLoading$;
    this.user = this.authService.user;

    this.cargarConfiguraciones();
    this.listar();
  }

  listar(page = 1) {

    let data = {
      buscar: this.buscar,
      bodega_id: this.bodega_id,
      unidad_inicio_id: this.unidad_inicio_id,
      unidad_final_id: this.unidad_final_id,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_final,
      articulo: this.articulo,
    };

    this.conversionService.listar(page, data).subscribe((resp) => {
      if (resp && resp.conversiones && resp.conversiones.data) {
        this.conversiones = resp.conversiones.data.map((conversion) => ({
          ...conversion,
          estado: Number(conversion.estado), // Convierte el estado a número
        }));

        this.totalPages = resp.total; // Asigna el total de páginas desde `resp.total`
        this.currentPage = page; // Página actual

      } else {
        console.error('Estructura inesperada en la respuesta del servidor:', resp);
      }
      this.totalPages = resp.total;
      this.currentPage = page;
    });
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

  crear() {
    const modalRef = this.modalService.open(CreateConversionComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.unidades = this.unidades;
    modalRef.componentInstance.ConversionC.subscribe((conversion: Conversion) => {
      this.conversiones.unshift(conversion);
    });
  }

  loadPage($event: number) {
    this.listar($event);
  }

  cambiarEstado(conversion: Conversion) {
    const modalRef = this.modalService.open(DeleteConversionComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.ConversionSeleccionado = conversion;
    modalRef.componentInstance.ConversionD.subscribe((ConversionR: Conversion) => {
      let index = this.conversiones.findIndex((ConversionFind: Conversion) => ConversionFind.id === conversion.id);
      if (index != -1) {
        this.conversiones[index] = ConversionR;
      }
    });
  }

  cargarConfiguraciones() {
    this.generalService.cargarConfiguracionesConversiones(this.authService.user.empresa_id)
      .subscribe((response) => {
        this.empresas = response.empresas;
        this.unidades = response.unidades;
        this.bodegas = response.bodegas;

        this.bodegas = this.bodegas.map(bodega => {
          return { ...bodega, nombre: this.capitalize(bodega.nombre) };
        });

        this.unidades = this.unidades.map(unidad => {
          return { ...unidad, nombre: this.capitalize(unidad.nombre) };
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

  formatConversionId(id: number): string {
    return `Nº-${id.toString().padStart(6, '0')}`;
  }

  resetList() {
    this.buscar = '';
    this.bodega_id = 9999999;
    this.unidad_inicio_id = 9999999;
    this.unidad_final_id = 9999999;
    this.articulo = '';

    this.fecha_inicio = '';
    this.fecha_final = '';
    this.listar();
  }

  isPermission(permission: string) {
    return isPermission(permission);
  }
}
