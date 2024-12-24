import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PlantillasService } from '../../service/plantillas.service';
import { DetallePlantilla } from '../../interfaces';


@Component({
  selector: 'app-delete-detalle-plantilla',
  templateUrl: './delete-detalle-plantilla.component.html',
  styleUrl: './delete-detalle-plantilla.component.scss'
})
export class DeleteDetallePlantillaComponent implements OnInit {
  isLoading$: Observable<boolean>;
  @Output() DetalleD: EventEmitter<DetallePlantilla> = new EventEmitter;


  @Input() detalle: DetallePlantilla;
  @Input() plantilla_id: number;

  constructor(
    public modal: NgbActiveModal,
    public plantillaService: PlantillasService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.plantillaService.isLoading$;
  }

  delete() {
    this.DetalleD.emit();
    this.modal.close();
  }
}
