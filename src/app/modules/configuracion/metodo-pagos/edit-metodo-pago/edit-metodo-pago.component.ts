import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Sede } from '../../sedes/interfaces';
import { MetodoPago } from '../interfaces';
import { MetodoPagoService } from '../service/metodo-pago.service';

@Component({
  selector: 'app-edit-metodo-pago',
  templateUrl: './edit-metodo-pago.component.html',
  styleUrl: './edit-metodo-pago.component.scss'
})
export class EditMetodoPagoComponent implements OnInit{
  isLoading$: any;
  @Output() MetodoPagoE: EventEmitter<MetodoPago> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() metodosPagos: MetodoPago[] = [];

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

  store() {

    if (!this.metodoPago.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (this.metodoPago.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.metodoPagoService.editar(this.metodoPago).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.MetodoPagoE.emit(resp.metodoPago);
        this.modal.close();
      }
    });

  }
}
