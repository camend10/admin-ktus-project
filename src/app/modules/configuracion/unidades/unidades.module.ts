import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadesRoutingModule } from './unidades-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UnidadesComponent } from './unidades.component';
import { ListUnidadesComponent } from './list-unidades/list-unidades.component';
import { CreateUnidadComponent } from './create-unidad/create-unidad.component';
import { DeleteUnidadComponent } from './delete-unidad/delete-unidad.component';
import { EditUnidadComponent } from './edit-unidad/edit-unidad.component';
import { CreateTransformacionComponent } from './create-transformacion/create-transformacion.component';
import { DeleteTransformacionComponent } from './delete-transformacion/delete-transformacion.component';


@NgModule({
  declarations: [
    UnidadesComponent,
    ListUnidadesComponent,
    CreateUnidadComponent,
    EditUnidadComponent,
    DeleteUnidadComponent,
    CreateTransformacionComponent,
    DeleteTransformacionComponent
  ],
  imports: [
    CommonModule,
    UnidadesRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class UnidadesModule { }
