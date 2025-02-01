import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './reportes.component';
import { BajaExistenciaComponent } from './baja-existencia/baja-existencia.component';
import { VentasComponent } from './ventas/ventas.component';
import { VendidosComponent } from './vendidos/vendidos.component';
import { MovimientosReporteComponent } from './movimientos-reporte/movimientos-reporte.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    children: [
      {
        path: 'baja-existencia',
        component: BajaExistenciaComponent,
      },
      {
        path: 'ventas',
        component: VentasComponent,
      },
      {
        path: 'vendidos',
        component: VendidosComponent,
      },
      {
        path: 'movimientos',
        component: MovimientosReporteComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
