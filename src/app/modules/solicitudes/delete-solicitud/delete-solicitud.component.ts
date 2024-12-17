import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Movimiento } from '../interfaces';
import { SolicitudesService } from '../service/solicitudes.service';

@Component({
  selector: 'app-delete-solicitud',
  templateUrl: './delete-solicitud.component.html',
  styleUrl: './delete-solicitud.component.scss'
})
export class DeleteSolicitudComponent implements OnInit {

  isLoading$: any;
  @Output() MovimientoD: EventEmitter<Movimiento> = new EventEmitter;

  @Input() MovimientoSeleccionado: Movimiento;

  movimiento: Movimiento;

  constructor(
    public modal: NgbActiveModal,
    public solicitudService: SolicitudesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.solicitudService.isLoading$;
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
      this.solicitudService.cambiarEstado(this.movimiento, nuevoEstado).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.MovimientoD.emit(resp.solicitud);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de la factura no está definida.');
    }
  }

  formatMovimientoId(id: number): string {
    return `SOL-${id.toString().padStart(6, '0')}`;
  }
}
