import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ReportesComponent } from './reportes.component';
import { BajaExistenciaComponent } from './baja-existencia/baja-existencia.component';


@NgModule({
  declarations: [
    ReportesComponent,
    BajaExistenciaComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,

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
export class ReportesModule { }
