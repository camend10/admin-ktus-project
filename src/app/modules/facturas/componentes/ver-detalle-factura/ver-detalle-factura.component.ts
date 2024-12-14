import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { DetalleFactura, Factura } from '../../interfaces';

@Component({
  selector: 'app-ver-detalle-factura',
  templateUrl: './ver-detalle-factura.component.html',
  styleUrl: './ver-detalle-factura.component.scss'
})
export class VerDetalleFacturaComponent implements OnInit {

  isLoading$: Observable<boolean>;

  @Input() factura: Factura;

  totals: { subtotal: number; totalDescuento: number; totalIva: number; total: number } = {
    subtotal: 0,
    totalDescuento: 0,
    totalIva: 0,
    total: 0,
  };


  constructor(
    public modal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.totals = this.getTotals(this.factura.detalles || []);
  }

  getTotals(detalles: DetalleFactura[]) {
    return detalles.reduce(
      (totals, detalle) => {
        totals.subtotal += detalle.sub_total || 0;
        totals.totalDescuento += detalle.total_descuento || 0;
        totals.totalIva += detalle.total_iva || 0;
        totals.total += (detalle.sub_total - detalle.total_descuento + detalle.total_iva) || 0;
        return totals;
      },
      {
        subtotal: 0,
        totalDescuento: 0,
        totalIva: 0,
        total: 0,
      }
    );
  }


  formatFacturaId(id: number): string {
    return `FAC-${id.toString().padStart(6, '0')}`;
  }
}
