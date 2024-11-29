import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetodoPagosRoutingModule } from './metodo-pagos-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MetodoPagosComponent } from './metodo-pagos.component';
import { ListMetodoPagosComponent } from './list-metodo-pagos/list-metodo-pagos.component';
import { CreateMetodoPagoComponent } from './create-metodo-pago/create-metodo-pago.component';
import { EditMetodoPagoComponent } from './edit-metodo-pago/edit-metodo-pago.component';
import { DeleteMetodoPagoComponent } from './delete-metodo-pago/delete-metodo-pago.component';


@NgModule({
  declarations: [
    MetodoPagosComponent,
    ListMetodoPagosComponent,
    CreateMetodoPagoComponent,
    EditMetodoPagoComponent,
    DeleteMetodoPagoComponent
  ],
  imports: [
    CommonModule,
    MetodoPagosRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class MetodoPagosModule { }
