import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { MetodoPago } from '../interfaces';
import { MetodoPagoService } from '../service/metodo-pago.service';

@Component({
  selector: 'app-delete-metodo-pago',
  templateUrl: './delete-metodo-pago.component.html',
  styleUrl: './delete-metodo-pago.component.scss'
})
export class DeleteMetodoPagoComponent implements OnInit{

  name: string = '';
  isLoading$: any;
  @Output() MetodoPagoD: EventEmitter<MetodoPago> = new EventEmitter;
  @Input() MetodoPagoSeleccionado: MetodoPago;

  metodoPago: MetodoPago = {
    id: 0,
    nombre: '',
    empresa_id: 9999999,
    metodo_pago_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public metodoPagoService: MetodoPagoService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.metodoPagoService.isLoading$;
    this.metodoPago = { ...this.MetodoPagoSeleccionado };
    this.metodoPago.estado = Number(this.metodoPago.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.metodoPago.estado === 1 ? 0 : 1;
    if (this.metodoPago.estado === 1) {
      this.metodoPago.estado = 0;
    } else {
      this.metodoPago.estado = 1;
    }

    this.metodoPagoService.cambiarEstado(this.metodoPago, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.MetodoPagoD.emit(resp.metodoPago);
        this.modal.close();
      }
    });

  }

}
