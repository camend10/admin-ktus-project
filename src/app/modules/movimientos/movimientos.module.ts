import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { MovimientosComponent } from './movimientos.component';
import { CreateMovimientoComponent } from './create-movimiento/create-movimiento.component';
import { EditMovimientoComponent } from './edit-movimiento/edit-movimiento.component';
import { DeleteMovimientoComponent } from './delete-movimiento/delete-movimiento.component';
import { ListMovimientosComponent } from './list-movimientos/list-movimientos.component';
import { EditDetalleMovimientoComponent } from './componentes/edit-detalle-movimiento/edit-detalle-movimiento.component';
import { DeleteDetalleMovimientoComponent } from './componentes/delete-detalle-movimiento/delete-detalle-movimiento.component';


@NgModule({
  declarations: [
    MovimientosComponent,
    CreateMovimientoComponent,
    EditMovimientoComponent,
    DeleteMovimientoComponent,
    ListMovimientosComponent,
    EditDetalleMovimientoComponent,
    DeleteDetalleMovimientoComponent
  ],
  imports: [
    CommonModule,
    MovimientosRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    SharedModule
  ]
})
export class MovimientosModule { }
