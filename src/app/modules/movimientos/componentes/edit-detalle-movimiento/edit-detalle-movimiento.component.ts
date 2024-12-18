import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/modules/auth';
import { ToastrService } from 'ngx-toastr';
import { Unidad } from 'src/app/modules/configuracion/unidades/interfaces';
import { MovimientosService } from '../../service/movimientos.service';
import { DetalleMovimiento } from 'src/app/modules/solicitudes/interfaces';
import { BodegaArticulo } from 'src/app/modules/articulos/interfaces';


@Component({
  selector: 'app-edit-detalle-movimiento',
  templateUrl: './edit-detalle-movimiento.component.html',
  styleUrl: './edit-detalle-movimiento.component.scss'
})
export class EditDetalleMovimientoComponent implements OnInit {

  isLoading$: Observable<boolean>;

  @Input() detalle: DetalleMovimiento;
  @Input() bodega_id: number;
  unidades: Unidad[] = [];
  @Output() DetalleS: EventEmitter<DetalleMovimiento> = new EventEmitter;

  unidad_id: number = 9999999;
  costo: number = 0;
  cantidad: number = 0;

  constructor(
    public modal: NgbActiveModal,
    public movimientoService: MovimientosService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.movimientoService.isLoading$;
    this.unidad_id = this.detalle.unidad_id;
    this.cantidad = this.detalle.cantidad;
    this.costo = this.detalle.costo;

    if (this.detalle.articulo && this.detalle.articulo.bodegas_articulos) {
      this.unidades = this.detalle.articulo.bodegas_articulos
        .filter((bodega: BodegaArticulo) => bodega.bodega.id === this.bodega_id)
        .map((bodega: BodegaArticulo) => bodega.unidad);
    } else {
      this.unidades = [];
    }
  }

  edit() {

    const bodegaArticulo = this.detalle.articulo?.bodegas_articulos
      ?.find(
        (bodega: BodegaArticulo) =>
          bodega.unidad.id === this.unidad_id && bodega.bodega.id === this.bodega_id
      ) ?? null;

    if (bodegaArticulo && bodegaArticulo.cantidad < this.cantidad) {
      this.toast.error(
        'Validación',
        `No puedes solicitar esa cantidad, porque no hay stock disponible (${bodegaArticulo.cantidad})`
      );
      return;
    }

    if (this.unidad_id === 9999999) {
      this.toast.error('Validación', 'No ha seleccionado la unidad del artículo');
      return;
    }

    if (!this.costo) {
      this.toast.error('Validación', 'Por favor digite el costo');
      return;
    }

    if (!this.cantidad) {
      this.toast.error('Validación', 'No ha digitado la cantidad solicitada del artículo');
      return;
    }

    // Subtotal sin descuento
    const costoTotal = this.costo * this.cantidad;

    const unidad = this.unidades.find((item: Unidad) => item.id === this.unidad_id);
    // Actualizar el detalle con los nuevos valores
    this.detalle.cantidad = this.cantidad;
    this.detalle.cantidad_recibida = this.cantidad;
    this.detalle.unidad_id = this.unidad_id;
    this.detalle.unidad = unidad;
    this.detalle.costo = this.costo;
    this.detalle.total = costoTotal;

    this.DetalleS.emit(this.detalle);
    this.modal.close();
  }

  focusField(selector: string): void {
    const element = document.querySelector(selector) as HTMLSelectElement;

    if (element) {
      element.focus();

      if (element.tagName.toLowerCase() === 'select') {
        // Expande el dropdown al configurar size
        element.size = element.options.length;

        // Colapsa el dropdown cuando se pierde el foco
        element.addEventListener('blur', () => {
          element.size = 0;
        });
      }
    }
  }

  changeUnidadArticulo() {

    this.focusField('.costo-input-edit');
    this.isLoadingProcess();
    this.cdr.detectChanges();
  }

  seleccionarTexto(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input.select) {
      input.select(); // Selecciona el texto del input
    }
    this.isLoadingProcess();
  }

  isLoadingProcess() {
    this.movimientoService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.movimientoService.isLoadingSubject.next(false);
    }, 50);
  }
}
