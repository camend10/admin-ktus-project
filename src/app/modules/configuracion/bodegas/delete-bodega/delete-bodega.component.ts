import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Bodega } from '../interfaces';
import { BodegaService } from '../service/bodega.service';


@Component({
  selector: 'app-delete-bodega',
  templateUrl: './delete-bodega.component.html',
  styleUrl: './delete-bodega.component.scss'
})
export class DeleteBodegaComponent implements OnInit {
  
  name: string = '';
  isLoading$: any;
  @Output() BodegaD: EventEmitter<Bodega> = new EventEmitter;
  @Input() BodegaSeleccionado: Bodega;

  bodega: Bodega = {
    id: 0,
    nombre: '',
    descripcion: '',
    empresa_id: 9999999,
    sede_id: 9999999,
    estado: 1,

  };
  constructor(
    public modal: NgbActiveModal,
    public bodegaService: BodegaService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.bodegaService.isLoading$;
    this.bodega = { ...this.BodegaSeleccionado };
    this.bodega.estado = Number(this.bodega.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.bodega.estado === 1 ? 0 : 1;
    if (this.bodega.estado === 1) {
      this.bodega.estado = 0;
    } else {
      this.bodega.estado = 1;
    }

    this.bodegaService.cambiarEstado(this.bodega, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.BodegaD.emit(resp.bodega);
        this.modal.close();
      }
    });

  }
}
