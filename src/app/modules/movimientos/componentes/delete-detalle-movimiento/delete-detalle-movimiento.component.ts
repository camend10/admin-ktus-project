import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MovimientosService } from '../../service/movimientos.service';
import { DetalleMovimiento } from 'src/app/modules/solicitudes/interfaces';


@Component({
  selector: 'app-delete-detalle-movimiento',
  templateUrl: './delete-detalle-movimiento.component.html',
  styleUrl: './delete-detalle-movimiento.component.scss'
})
export class DeleteDetalleMovimientoComponent implements OnInit {


  isLoading$: Observable<boolean>;
  @Output() DetalleD: EventEmitter<DetalleMovimiento> = new EventEmitter;

  @Input() detalle: DetalleMovimiento;
  @Input() factura_id: number;

  constructor(
    public modal: NgbActiveModal,
    public movimientoService: MovimientosService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.movimientoService.isLoading$;
  }

  delete() {
    this.DetalleD.emit();
    this.modal.close();
  }
}
