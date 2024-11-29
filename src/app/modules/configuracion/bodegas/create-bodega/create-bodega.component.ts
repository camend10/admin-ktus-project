import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Sede } from '../../sedes/interfaces';
import { BodegaService } from '../service/bodega.service';
import { Bodega } from '../interfaces/index';
import { User } from 'src/app/modules/users/interfaces';
import { AuthService } from 'src/app/modules/auth';


@Component({
  selector: 'app-create-bodega',
  templateUrl: './create-bodega.component.html',
  styleUrl: './create-bodega.component.scss'
})
export class CreateBodegaComponent implements OnInit {

  isLoading$: any;
  @Output() BodegaC: EventEmitter<Bodega> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() sedes: Sede[] = [];

  user: User;

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
    public authService: AuthService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.bodegaService.isLoading$;
    this.user = this.authService.user;
    this.bodega.empresa_id = this.user.empresa_id;
  }

  store() {

    if (!this.bodega.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (this.bodega.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    if (this.bodega.sede_id === 9999999) {
      this.toast.error('Validación', 'La sede es requerida');
      return false;
    }


    this.bodegaService.registrar(this.bodega).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.BodegaC.emit(resp.bodega);
        this.modal.close();
      }
    });

  }
}
