import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Empresa } from 'src/app/interfaces';
import { Unidad } from '../interfaces';
import { UnidadesService } from '../service/unidades.service';

@Component({
  selector: 'app-edit-unidad',
  templateUrl: './edit-unidad.component.html',
  styleUrl: './edit-unidad.component.scss'
})
export class EditUnidadComponent implements OnInit {

  isLoading$: any;
  @Output() UnidadE: EventEmitter<Unidad> = new EventEmitter;

  @Input() empresas: Empresa[] = [];

  @Input() UnidadSeleccionado: Unidad;

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
    public toast: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.unidadesService.isLoading$;

    this.unidad = { ...this.UnidadSeleccionado };
    this.unidad.estado = Number(this.UnidadSeleccionado.estado);
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

    this.unidadesService.editar(this.unidad).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.UnidadE.emit(resp.unidad);
        this.modal.close();
      }
    });

  }
}
