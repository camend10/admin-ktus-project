import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { ListClientesComponent } from './list-clientes/list-clientes.component';
import { CreateClienteComponent } from './create-cliente/create-cliente.component';
import { EditClienteComponent } from './edit-cliente/edit-cliente.component';
import { DeleteClienteComponent } from './delete-cliente/delete-cliente.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ImportClienteComponent } from './import-cliente/import-cliente.component';


@NgModule({
  declarations: [
    ClientesComponent,
    ListClientesComponent,
    CreateClienteComponent,
    EditClienteComponent,
    DeleteClienteComponent,
    ImportClienteComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class ClientesModule { }
