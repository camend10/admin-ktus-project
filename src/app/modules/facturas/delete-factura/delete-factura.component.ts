import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FacturasService } from '../service/facturas.service';
import { Factura } from '../interfaces';

@Component({
  selector: 'app-delete-factura',
  templateUrl: './delete-factura.component.html',
  styleUrl: './delete-factura.component.scss'
})
export class DeleteFacturaComponent implements OnInit {
  isLoading$: any;
  @Output() FacturaD: EventEmitter<Factura> = new EventEmitter;

  @Input() FacturaSeleccionado: Factura;

  factura: Factura;

  constructor(
    public modal: NgbActiveModal,
    public facturaService: FacturasService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.facturaService.isLoading$;
    this.factura = { ...this.FacturaSeleccionado };
  }

  cambiarEstado() {
    const nuevoEstado = this.factura.estado === 1 ? 0 : 1;
    if (this.factura.estado === 1) {
      this.factura.estado = 0;
    } else {
      this.factura.estado = 1;
    }

    if (this.factura.id !== undefined) {
      this.facturaService.cambiarEstado(this.factura, nuevoEstado).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.FacturaD.emit(resp.factura);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de la factura no está definida.');
    }
  }

  formatFacturaId(id: number): string {
    return `FAC-${id.toString().padStart(6, '0')}`;
  }
}
