import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedesRoutingModule } from './sedes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ListSedeComponent } from './list-sede/list-sede.component';
import { CreateSedeComponent } from './create-sede/create-sede.component';
import { EditSedeComponent } from './edit-sede/edit-sede.component';
import { DeleteSedeComponent } from './delete-sede/delete-sede.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SedesComponent } from './sedes.component';


@NgModule({
  declarations: [
    ListSedeComponent,
    CreateSedeComponent,
    EditSedeComponent,
    DeleteSedeComponent,
    SedesComponent
  ],
  imports: [
    CommonModule,
    SedesRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class SedesModule { }
