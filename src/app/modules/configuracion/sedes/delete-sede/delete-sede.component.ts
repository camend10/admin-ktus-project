import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Sede } from '../interfaces';
import { SedeService } from '../service/sede.service';

@Component({
  selector: 'app-delete-sede',
  templateUrl: './delete-sede.component.html',
  styleUrl: './delete-sede.component.scss'
})
export class DeleteSedeComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() SedeD: EventEmitter<Sede> = new EventEmitter;
  @Input() SedeSeleccionado: Sede;

  sede: Sede = {
    id: 0,
    codigo: '',
    nombre: '',
    direccion: '',
    telefono: 0,
    celular: 0,
    responsable: '',
    telefono_responsable: 0,
    empresa_id: 0,
    estado: 1,
    identificacion_responsable: '',
    departamento_id: 0,
    municipio_id: 0,
    empresa: {
      id: 0,
      nit_empresa: '',
      dv: '',
      nombre: '',
      email: '',
      direccion: '',
      telefono: '',
      web: '',
      celular: '',
    }
  };

  constructor(
    public modal: NgbActiveModal,
    public sedeService: SedeService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.sedeService.isLoading$;
    this.sede = { ...this.SedeSeleccionado };
    this.sede.estado = Number(this.sede.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.sede.estado === 1 ? 0 : 1;
    if (this.sede.estado === 1) {
      this.sede.estado = 0;
    } else {
      this.sede.estado = 1;
    }

    this.sedeService.cambiarEstado(this.sede, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SedeD.emit(resp.sede);
        this.modal.close();
      }
    });

  }
}
