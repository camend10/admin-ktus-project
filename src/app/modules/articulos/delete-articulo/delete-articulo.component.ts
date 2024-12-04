import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Articulo } from '../interfaces';
import { ArticulosService } from '../service/articulos.service';

@Component({
  selector: 'app-delete-articulo',
  templateUrl: './delete-articulo.component.html',
  styleUrl: './delete-articulo.component.scss'
})
export class DeleteArticuloComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() ArticuloD: EventEmitter<Articulo> = new EventEmitter;

  @Input() ArticuloSeleccionado: Articulo;

  articulo: Articulo;

  constructor(
    public modal: NgbActiveModal,
    public articulosService: ArticulosService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.articulosService.isLoading$;
    this.articulo = { ...this.ArticuloSeleccionado };
  }

  cambiarEstado() {
    const nuevoEstado = this.articulo.estado === 1 ? 0 : 1;
    if (this.articulo.estado === 1) {
      this.articulo.estado = 0;
    } else {
      this.articulo.estado = 1;
    }

    if (this.articulo.id !== undefined) {
      this.articulosService.cambiarEstado(this.articulo, nuevoEstado).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.ArticuloD.emit(resp.articulo);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID del artículo no está definido.');
    }


  }
}
