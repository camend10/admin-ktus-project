import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Unidad } from '../interfaces';
import { UnidadesService } from '../service/unidades.service';

@Component({
  selector: 'app-delete-unidad',
  templateUrl: './delete-unidad.component.html',
  styleUrl: './delete-unidad.component.scss'
})
export class DeleteUnidadComponent implements OnInit {

  name: string = '';
  isLoading$: any;
  @Output() UnidadD: EventEmitter<Unidad> = new EventEmitter;
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
    this.unidad.estado = Number(this.unidad.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.unidad.estado === 1 ? 0 : 1;
    if (this.unidad.estado === 1) {
      this.unidad.estado = 0;
    } else {
      this.unidad.estado = 1;
    }

    this.unidadesService.cambiarEstado(this.unidad, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.UnidadD.emit(this.unidad);
        this.modal.close();
      }
    });

  }

}
