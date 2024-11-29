import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';
import { Unidad } from '../interfaces';
import { UnidadesService } from '../service/unidades.service';



@Component({
  selector: 'app-create-unidad',
  templateUrl: './create-unidad.component.html',
  styleUrl: './create-unidad.component.scss'
})
export class CreateUnidadComponent implements OnInit {

  isLoading$: any;
  @Output() UnidadC: EventEmitter<Unidad> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

  user: User;

  unidad: Unidad = {
    id: 0,
    nombre: '',
    sigla: '',
    descripcion: '',
    empresa_id: 9999999,
    estado: 1,
  };

  constructor(
    public modal: NgbActiveModal,
    public unidadesService: UnidadesService,
    public generalService: GeneralesService,
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }
  
  ngOnInit(): void {
    this.isLoading$ = this.unidadesService.isLoading$;
    this.user = this.authService.user;
    this.unidad.empresa_id = this.user.empresa_id;
  }

  store() {

    if (!this.unidad.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (!this.unidad.sigla) {
      this.toast.error('Validación', 'La sigla es requerida');
      return false;
    }

    if (this.unidad.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    this.unidadesService.registrar(this.unidad).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.UnidadC.emit(resp.unidad);
        this.modal.close();
      }
    });

  }

}
