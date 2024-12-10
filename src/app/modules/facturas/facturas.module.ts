import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturasRoutingModule } from './facturas-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FacturasComponent } from './facturas.component';
import { ListFacturasComponent } from './list-facturas/list-facturas.component';
import { CreateFacturaComponent } from './create-factura/create-factura.component';
import { EditFacturaComponent } from './edit-factura/edit-factura.component';
import { DeleteFacturaComponent } from './delete-factura/delete-factura.component';
import { AddPagosComponent } from './componentes/add-pagos/add-pagos.component';
import { BuscarArticuloComponent } from './componentes/buscar-articulo/buscar-articulo.component';
import { BuscarClienteComponent } from './componentes/buscar-cliente/buscar-cliente.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { EditArticuloFacturaComponent } from './componentes/edit-articulo-factura/edit-articulo-factura.component';
import { DeleteArticuloFacturaComponent } from './componentes/delete-articulo-factura/delete-articulo-factura.component';


@NgModule({
  declarations: [
    FacturasComponent,
    ListFacturasComponent,
    CreateFacturaComponent,
    EditFacturaComponent,
    DeleteFacturaComponent,
    AddPagosComponent,
    BuscarArticuloComponent,
    BuscarClienteComponent,
    EditArticuloFacturaComponent,
    DeleteArticuloFacturaComponent
  ],
  imports: [
    CommonModule,
    FacturasRoutingModule,
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
export class FacturasModule { }
