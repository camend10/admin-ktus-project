import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConversionesService } from '../service/conversiones.service';
import { Conversion } from '../interfaces';

@Component({
  selector: 'app-delete-conversion',
  templateUrl: './delete-conversion.component.html',
  styleUrl: './delete-conversion.component.scss'
})
export class DeleteConversionComponent implements OnInit {

  isLoading$: any;
  @Output() ConversionD: EventEmitter<Conversion> = new EventEmitter;

  @Input() ConversionSeleccionado: Conversion;

  conversion: Conversion;

  constructor(
    public modal: NgbActiveModal,
    public conversionService: ConversionesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.conversionService.isLoading$;
    this.conversion = { ...this.ConversionSeleccionado };
  }

  cambiarEstado() {
    const nuevoEstado = this.conversion.estado === 1 ? 0 : 1;
    if (this.conversion.estado === 1) {
      this.conversion.estado = 0;
    } else {
      this.conversion.estado = 1;
    }

    if (this.conversion.id !== undefined) {
      this.conversionService.cambiarEstado(this.conversion, nuevoEstado).subscribe((resp) => {

        if (resp.message === 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', resp.message_text);
          this.ConversionD.emit(resp.conversion);
          this.modal.close();
        }
      });
    } else {
      this.toast.error('Error', 'El ID de la factura no está definida.');
    }
  }

  formatConversionId(id: number): string {
    return `Nº-${id.toString().padStart(6, '0')}`;
  }
}
