import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DetalleMovimiento } from '../../interfaces';
import { SolicitudesService } from '../../service/solicitudes.service';

@Component({
  selector: 'app-delete-item-solicitud',
  templateUrl: './delete-item-solicitud.component.html',
  styleUrl: './delete-item-solicitud.component.scss'
})
export class DeleteItemSolicitudComponent implements OnInit {

  isLoading$: Observable<boolean>;
  @Output() DetalleD: EventEmitter<DetalleMovimiento> = new EventEmitter;

  @Input() detalle: DetalleMovimiento;
  @Input() factura_id: number;

  constructor(
    public modal: NgbActiveModal,
    public solicitudService: SolicitudesService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.solicitudService.isLoading$;
  }

  delete() {
    this.DetalleD.emit();
    this.modal.close();
  }
}
