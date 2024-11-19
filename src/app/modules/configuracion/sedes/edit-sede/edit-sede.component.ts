import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Departamento, Empresa, Municipio } from 'src/app/interfaces';
import { Sede } from '../interfaces';
import { SedeService } from '../service/sede.service';

@Component({
  selector: 'app-edit-sede',
  templateUrl: './edit-sede.component.html',
  styleUrl: './edit-sede.component.scss'
})
export class EditSedeComponent implements OnInit {
  isLoading$: any;
  @Output() SedeE: EventEmitter<Sede> = new EventEmitter;

  @Input() empresas: Empresa[] = [];
  @Input() SedeSeleccionado: Sede;

  @Input() departamentos: Departamento[] = [];
  @Input() municipios: Municipio[] = [];

  sede: Sede = {
    id: 0,
    codigo: '',
    nombre: '',
    direccion: '',
    telefono: 0,
    celular: 0,
    responsable: '',
    telefono_responsable: 0,
    empresa_id: 9999999,
    estado: 1,
    identificacion_responsable: '',
    departamento_id: 9999999,
    municipio_id: 9999999,
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

  store() {

    if (!this.sede.codigo) {
      this.toast.error('Validación', 'El código es requerido');
      return false;
    }

    if (!this.sede.nombre) {
      this.toast.error('Validación', 'El nombre es requerido');
      return false;
    }

    if (!this.sede.direccion) {
      this.toast.error('Validación', 'La dirección es requerida');
      return false;
    }

    if (!this.sede.celular) {
      this.toast.error('Validación', 'El celular es requerido');
      return false;
    }

    if (!this.sede.identificacion_responsable) {
      this.toast.error('Validación', 'La identificación del responsable es requerida');
      return false;
    } else if (!/^\d+$/.test(this.sede.identificacion_responsable)) {
      this.toast.error('Validación', 'La identificación del responsable debe contener solo números');
      return false;
    }

    if (!this.sede.responsable) {
      this.toast.error('Validación', 'El responsable es requerido');
      return false;
    }

    if (!this.sede.telefono_responsable) {
      this.toast.error('Validación', 'El telefono del responsable es requerido');
      return false;
    }

    if (this.sede.empresa_id === 9999999) {
      this.toast.error('Validación', 'La empresa es requerida');
      return false;
    }

    if (this.sede.departamento_id === 9999999) {
      this.toast.error('Validación', 'El departamento es requerido');
      return false;
    }

    if (this.sede.municipio_id === 9999999) {
      this.toast.error('Validación', 'El municipio es requerido');
      return false;
    }

    this.sedeService.editar(this.sede).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.SedeE.emit(resp.sede);
        this.modal.close();
      }
    });

  }
}
