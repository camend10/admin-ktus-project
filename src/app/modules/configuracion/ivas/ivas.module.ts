import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IvasRoutingModule } from './ivas-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { IvasComponent } from './ivas.component';
import { ListIvasComponent } from './list-ivas/list-ivas.component';
import { CreateIvaComponent } from './create-iva/create-iva.component';
import { EditIvaComponent } from './edit-iva/edit-iva.component';
import { DeleteIvaComponent } from './delete-iva/delete-iva.component';


@NgModule({
  declarations: [
    IvasComponent,
    ListIvasComponent,
    CreateIvaComponent,
    EditIvaComponent,
    DeleteIvaComponent
  ],
  imports: [
    CommonModule,
    IvasRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class IvasModule { }
