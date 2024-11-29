import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { SegmentoCliente } from '../interfaces';
import { SegmentoClienteService } from '../service/segmento-cliente.service';

@Component({
  selector: 'app-create-segmento-cliente',
  templateUrl: './create-segmento-cliente.component.html',
  styleUrl: './create-segmento-cliente.component.scss'
})
export class CreateSegmentoClienteComponent implements OnInit {

  isLoading$: any;
  @Output() SegmentoClienteC: EventEmitter<SegmentoCliente> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

  user: User;

  segmentoCliente: SegmentoCliente = {
    id: 0,
    nombre: '',
    empresa_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public segmentoClienteService: SegmentoClienteService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.segmentoClienteService.isLoading$;
    this.user = this.authService.user;
    this.segmentoCliente.empresa_id = this.user.empresa_id;
  }

  store() {

    if (!this.segmentoCliente.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (this.segmentoCliente.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.segmentoClienteService.registrar(this.segmentoCliente).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SegmentoClienteC.emit(resp.segmentoCliente);
        this.modal.close();
      }
    });

  }
}
