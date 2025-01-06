import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversionesRoutingModule } from './conversiones-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ConversionesComponent } from './conversiones.component';
import { CreateConversionComponent } from './create-conversion/create-conversion.component';
import { DeleteConversionComponent } from './delete-conversion/delete-conversion.component';
import { ListConversionesComponent } from './list-conversiones/list-conversiones.component';


@NgModule({
  declarations: [
    ConversionesComponent,
    CreateConversionComponent,
    DeleteConversionComponent,
    ListConversionesComponent
  ],
  imports: [
    CommonModule,
    ConversionesRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class ConversionesModule { }
