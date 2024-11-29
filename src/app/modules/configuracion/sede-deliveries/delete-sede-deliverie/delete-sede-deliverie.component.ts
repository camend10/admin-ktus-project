import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { SedeDeliverie } from '../interfaces';
import { SedeDeliverieService } from '../service/sede-deliverie.service';


@Component({
  selector: 'app-delete-sede-deliverie',
  templateUrl: './delete-sede-deliverie.component.html',
  styleUrl: './delete-sede-deliverie.component.scss'
})
export class DeleteSedeDeliverieComponent implements OnInit {
  name: string = '';
  isLoading$: any;
  @Output() SedeDeliverieD: EventEmitter<SedeDeliverie> = new EventEmitter;
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
    this.sedeDeliverie.estado = Number(this.sedeDeliverie.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.sedeDeliverie.estado === 1 ? 0 : 1;
    if (this.sedeDeliverie.estado === 1) {
      this.sedeDeliverie.estado = 0;
    } else {
      this.sedeDeliverie.estado = 1;
    }

    this.sedeDeliverieService.cambiarEstado(this.sedeDeliverie, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SedeDeliverieD.emit(this.sedeDeliverie);
        this.modal.close();
      }
    });

  }
}
