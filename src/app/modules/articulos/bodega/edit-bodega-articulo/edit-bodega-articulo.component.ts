import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BodegaArticulo } from '../../interfaces';
import { BodegaArticuloService } from '../../service/bodega-articulo.service';
import { Unidad } from 'src/app/modules/configuracion/unidades/interfaces';
import { Bodega } from 'src/app/modules/configuracion/bodegas/interfaces';

@Component({
  selector: 'app-edit-bodega-articulo',
  templateUrl: './edit-bodega-articulo.component.html',
  styleUrl: './edit-bodega-articulo.component.scss'
})
export class EditBodegaArticuloComponent implements OnInit {

  isLoading$: any;
  @Output() BodegaArticuloE: EventEmitter<BodegaArticulo> = new EventEmitter;

  @Input() BodegaArticuloSeleccionado: BodegaArticulo;
  @Input() unidades: Unidad[];
  @Input() bodegas: Bodega[];
  @Input() articulo_id: number;

  unidad_id_bodegas: number = 9999999;
  bodega_id_bodegas: number = 9999999;
  cantidad_bodegas: number = 0;

  bodegaArticulo: BodegaArticulo;

  constructor(
    public modal: NgbActiveModal,
    public bodegaArticuloService: BodegaArticuloService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.bodegaArticuloService.isLoading$;
    this.bodegaArticulo = { ...this.BodegaArticuloSeleccionado };

    this.unidad_id_bodegas = this.bodegaArticulo.unidad.id;
    this.bodega_id_bodegas = this.bodegaArticulo.bodega.id;
    this.cantidad_bodegas = this.bodegaArticulo.cantidad;
  }

  store() {

    if (this.unidad_id_bodegas === 9999999) {
      this.toast.error('Validación', 'Necesitas seleccionar una unidad');
      return false;
    }

    if (this.bodega_id_bodegas === 9999999) {
      this.toast.error('Validación', 'Necesitas seleccionar una bodega');
      return false;
    }

    if (!this.cantidad_bodegas) {
      this.toast.error('Validación', 'Necesitas colocar una cantidad');
      return false;
    }

    if (this.bodegaArticulo.id !== undefined) {
      let data = {
        id: this.bodegaArticulo.id,
        articulo_id: this.articulo_id,
        unidad_id: this.unidad_id_bodegas,
        bodega_id: this.bodega_id_bodegas,
        cantidad: this.cantidad_bodegas
      }

      this.bodegaArticuloService.editar(this.bodegaArticulo.id, data).subscribe((resp) => {
        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.BodegaArticuloE.emit(resp.bodega_articulo);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de bodega artículo no está definido.');
    }


  }
}
