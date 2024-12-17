import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralesService } from 'src/app/services/generales.service';
import { Observable } from 'rxjs';
import { FacturasService } from '../../service/facturas.service';
import { DetalleFactura } from '../../interfaces';

@Component({
  selector: 'app-delete-articulo-factura',
  templateUrl: './delete-articulo-factura.component.html',
  styleUrl: './delete-articulo-factura.component.scss'
})
export class DeleteArticuloFacturaComponent implements OnInit {

  isLoading$: Observable<boolean>;
  @Output() DetalleD: EventEmitter<DetalleFactura> = new EventEmitter;

  @Input() detalle: DetalleFactura;
  @Input() factura_id: number;

  constructor(
    public modal: NgbActiveModal,
    public facturaService: FacturasService,
    private cdr: ChangeDetectorRef,
    public toast: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.facturaService.isLoading$;
  }

  delete() {
    this.DetalleD.emit();
    this.modal.close();
    // if (this.factura_id) {
    //   this.facturaService.deleteItemDetalle(this.detalle.id).subscribe((resp) => {
    //     this.DetalleD.emit();
    //     this.modal.close();
    //   });
    // } else {
    //   this.DetalleD.emit();
    //   this.modal.close();
    // }
  }
}
