import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodegasRoutingModule } from './bodegas-routing.module';
import { BodegasComponent } from './bodegas.component';
import { ListBodegasComponent } from './list-bodegas/list-bodegas.component';
import { CreateBodegaComponent } from './create-bodega/create-bodega.component';
import { EditBodegaComponent } from './edit-bodega/edit-bodega.component';
import { DeleteBodegaComponent } from './delete-bodega/delete-bodega.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    BodegasComponent,
    ListBodegasComponent,
    CreateBodegaComponent,
    EditBodegaComponent,
    DeleteBodegaComponent
  ],
  imports: [
    CommonModule,
    BodegasRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class BodegasModule { }
