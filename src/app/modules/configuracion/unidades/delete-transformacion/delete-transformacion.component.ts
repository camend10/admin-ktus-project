import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Unidad, UnidadTransformacion } from '../interfaces';
import { UnidadesService } from '../service/unidades.service';

@Component({
  selector: 'app-delete-transformacion',
  templateUrl: './delete-transformacion.component.html',
  styleUrl: './delete-transformacion.component.scss'
})
export class DeleteTransformacionComponent implements OnInit {

  isLoading$: any;
  @Output() UnidadTransformacionD: EventEmitter<UnidadTransformacion> = new EventEmitter;
  @Input() UnidadTransformacionSeleccionado: UnidadTransformacion;

  unidadTransformacion: UnidadTransformacion = {
    id: 0,
    unidad_id: 9999999,
    unidad_to_id: 9999999,
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
    this.unidadTransformacion = { ...this.UnidadTransformacionSeleccionado };
    this.unidadTransformacion.estado = Number(this.unidadTransformacion.estado);
  }

  delete() {

    this.unidadesService.deleteTransformacion(this.UnidadTransformacionSeleccionado).subscribe((resp) => {
      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.UnidadTransformacionD.emit(resp.unidadTransformacion);
        this.toast.success('Exito', resp.message_text);
        this.modal.close();
        // this.UnidadC.emit(resp.unidad);
      }
    });

  }

}
