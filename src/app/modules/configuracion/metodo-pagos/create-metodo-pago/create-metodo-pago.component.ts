import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Sede } from '../../sedes/interfaces';
import { MetodoPago } from '../interfaces/index';
import { MetodoPagoService } from '../service/metodo-pago.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';


@Component({
  selector: 'app-create-metodo-pago',
  templateUrl: './create-metodo-pago.component.html',
  styleUrl: './create-metodo-pago.component.scss'
})
export class CreateMetodoPagoComponent implements OnInit {

  isLoading$: Observable<boolean>;
  @Output() MetodoPagoC: EventEmitter<MetodoPago> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() metodosPagos: MetodoPago[] = [];

  user: User;

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
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.metodoPagoService.isLoading$;
    this.user = this.authService.user;
    this.metodoPago.empresa_id = this.user.empresa_id;
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

    this.metodoPagoService.registrar(this.metodoPago).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.MetodoPagoC.emit(resp.metodoPago);
        this.modal.close();
      }
    });

  }
}
