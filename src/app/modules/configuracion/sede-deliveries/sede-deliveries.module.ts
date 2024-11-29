import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedeDeliveriesRoutingModule } from './sede-deliveries-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SedeDeliveriesComponent } from './sede-deliveries.component';
import { CreateSedeDeliverieComponent } from './create-sede-deliverie/create-sede-deliverie.component';
import { EditSedeDeliverieComponent } from './edit-sede-deliverie/edit-sede-deliverie.component';
import { DeleteSedeDeliverieComponent } from './delete-sede-deliverie/delete-sede-deliverie.component';
import { ListSedeDeliverieComponent } from './list-sede-deliverie/list-sede-deliverie.component';


@NgModule({
  declarations: [
    SedeDeliveriesComponent,
    CreateSedeDeliverieComponent,
    EditSedeDeliverieComponent,
    DeleteSedeDeliverieComponent,
    ListSedeDeliverieComponent
  ],
  imports: [
    CommonModule,
    SedeDeliveriesRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class SedeDeliveriesModule { }
