import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { PlantillasService } from '../service/plantillas.service';
import { Plantilla } from '../interfaces';



@Component({
  selector: 'app-delete-plantilla',
  templateUrl: './delete-plantilla.component.html',
  styleUrl: './delete-plantilla.component.scss'
})
export class DeletePlantillaComponent implements OnInit {


  name: string = '';
  isLoading$: any;
  @Output() PlantillaD: EventEmitter<Plantilla> = new EventEmitter;
  @Input() PlantillaSeleccionado: Plantilla;

  plantilla: Plantilla = {
    id: 0,
    codigo: '',
    nombre: '',
    observacion: '',
    empresa_id: 0,
    sede_id: 0,
    user_id: 0,
    estado: 1,
    detalles_plantillas: []
  };

  constructor(
    public modal: NgbActiveModal,
    public plantillaService: PlantillasService,
    public generalService: GeneralesService,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.plantillaService.isLoading$;
    this.plantilla = { ...this.PlantillaSeleccionado };
    this.plantilla.estado = Number(this.plantilla.estado);
  }

  cambiarEstado() {

    const nuevoEstado = this.plantilla.estado === 1 ? 0 : 1;
    if (this.plantilla.estado === 1) {
      this.plantilla.estado = 0;
    } else {
      this.plantilla.estado = 1;
    }

    this.plantillaService.cambiarEstado(this.plantilla, nuevoEstado).subscribe((resp) => {

      if (resp.message === 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', resp.message_text);
        this.PlantillaD.emit(resp.plantilla);
        this.modal.close();
      }
    });

  }

}
