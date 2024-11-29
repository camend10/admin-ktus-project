import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { BodegaArticulo } from '../../interfaces';
import { BodegaArticuloService } from '../../service/bodega-articulo.service';


@Component({
  selector: 'app-delete-bodega-articulo',
  templateUrl: './delete-bodega-articulo.component.html',
  styleUrl: './delete-bodega-articulo.component.scss'
})
export class DeleteBodegaArticuloComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() BodegaArticuloD: EventEmitter<BodegaArticulo> = new EventEmitter;

  @Input() BodegaArticuloSeleccionado: BodegaArticulo;

  bodegaArticulo: BodegaArticulo;

  constructor(
    public modal: NgbActiveModal,
    public bodegaArticuloService: BodegaArticuloService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.bodegaArticuloService.isLoading$;
    this.bodegaArticulo = { ...this.BodegaArticuloSeleccionado };
  }

  delete() {

    if (this.bodegaArticulo.id !== undefined) {
      this.bodegaArticuloService.delete(this.bodegaArticulo.id).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.BodegaArticuloD.emit(resp.bodega_articulo);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de bodega artículo no está definido.');
    }


  }

}
