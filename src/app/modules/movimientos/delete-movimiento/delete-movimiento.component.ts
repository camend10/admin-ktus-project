import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MovimientosService } from '../service/movimientos.service';
import { Movimiento } from '../../solicitudes/interfaces';



@Component({
  selector: 'app-delete-movimiento',
  templateUrl: './delete-movimiento.component.html',
  styleUrl: './delete-movimiento.component.scss'
})
export class DeleteMovimientoComponent implements OnInit {
  isLoading$: any;
  @Output() MovimientoD: EventEmitter<Movimiento> = new EventEmitter;

  @Input() MovimientoSeleccionado: Movimiento;

  movimiento: Movimiento;

  constructor(
    public modal: NgbActiveModal,
    public movimientoService: MovimientosService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.movimientoService.isLoading$;
    this.movimiento = { ...this.MovimientoSeleccionado };
  }

  cambiarEstado() {
    const nuevoEstado = this.movimiento.estado === 1 ? 0 : 1;
    if (this.movimiento.estado === 1) {
      this.movimiento.estado = 0;
    } else {
      this.movimiento.estado = 1;
    }

    if (this.movimiento.id !== undefined) {
      this.movimientoService.cambiarEstado(this.movimiento, nuevoEstado).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.MovimientoD.emit(resp.movimiento);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID no está definida.');
    }
  }

  formatMovimientoId(id: number): string {
    return `MOV-${id.toString().padStart(6, '0')}`;
  }
}
