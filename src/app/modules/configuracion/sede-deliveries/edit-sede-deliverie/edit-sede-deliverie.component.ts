import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Sede } from '../../sedes/interfaces';
import { SedeDeliverie } from '../interfaces';
import { SedeDeliverieService } from '../service/sede-deliverie.service';


@Component({
  selector: 'app-edit-sede-deliverie',
  templateUrl: './edit-sede-deliverie.component.html',
  styleUrl: './edit-sede-deliverie.component.scss'
})
export class EditSedeDeliverieComponent implements OnInit {
  isLoading$: any;
  @Output() SedeDeliverieE: EventEmitter<SedeDeliverie> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() sedes: Sede[] = [];

  @Input() SedeDeliverieSeleccionado: SedeDeliverie;

  sedeDeliverie: SedeDeliverie = {
    id: 0,
    nombre: '',
    direccion: '',
    empresa_id: 9999999,
    sede_id: 9999999,
    estado: 1,

  };

  constructor(
    public modal: NgbActiveModal,
    public sedeDeliverieService: SedeDeliverieService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.sedeDeliverieService.isLoading$;

    this.sedeDeliverie = { ...this.SedeDeliverieSeleccionado };
    this.sedeDeliverie.estado = Number(this.SedeDeliverieSeleccionado.estado);
  }

  store() {

    if (!this.sedeDeliverie.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (this.sedeDeliverie.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    if (this.sedeDeliverie.sede_id === 9999999) {
      this.toast.error('Validación', 'La sede es requerida');
      return false;
    }

    this.sedeDeliverieService.editar(this.sedeDeliverie).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SedeDeliverieE.emit(resp.sedeDeliverie);
        this.modal.close();
      }
    });

  }
}
