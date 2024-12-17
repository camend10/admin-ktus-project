import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { SolicitudesComponent } from './solicitudes.component';
import { CreateSolicitudComponent } from './create-solicitud/create-solicitud.component';
import { EditSolicitudComponent } from './edit-solicitud/edit-solicitud.component';
import { DeleteSolicitudComponent } from './delete-solicitud/delete-solicitud.component';
import { ListSolicitudesComponent } from './list-solicitudes/list-solicitudes.component';
import { EditItemSolicitudComponent } from './componentes/edit-item-solicitud/edit-item-solicitud.component';
import { DeleteItemSolicitudComponent } from './componentes/delete-item-solicitud/delete-item-solicitud.component';


@NgModule({
  declarations: [
    SolicitudesComponent,
    CreateSolicitudComponent,
    EditSolicitudComponent,
    DeleteSolicitudComponent,
    ListSolicitudesComponent,
    EditItemSolicitudComponent,
    DeleteItemSolicitudComponent
  ],
  imports: [
    CommonModule,
    SolicitudesRoutingModule, 
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
export class SolicitudesModule { }
