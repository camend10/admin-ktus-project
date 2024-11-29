import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentoClientesRoutingModule } from './segmento-clientes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SegmentoClientesComponent } from './segmento-clientes.component';
import { ListSegmentoClientesComponent } from './list-segmento-clientes/list-segmento-clientes.component';
import { CreateSegmentoClienteComponent } from './create-segmento-cliente/create-segmento-cliente.component';
import { EditSegmentoClienteComponent } from './edit-segmento-cliente/edit-segmento-cliente.component';
import { DeleteSegmentoClienteComponent } from './delete-segmento-cliente/delete-segmento-cliente.component';


@NgModule({
  declarations: [
    SegmentoClientesComponent,
    ListSegmentoClientesComponent,
    CreateSegmentoClienteComponent,
    EditSegmentoClienteComponent,
    DeleteSegmentoClienteComponent
  ],
  imports: [
    CommonModule,
    SegmentoClientesRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class SegmentoClientesModule { }
