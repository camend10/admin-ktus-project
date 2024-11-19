import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresasRoutingModule } from './empresas-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ListEmpresaComponent } from './list-empresa/list-empresa.component';
import { EditEmpresaComponent } from './edit-empresa/edit-empresa.component';
import { DeleteEmpresaComponent } from './delete-empresa/delete-empresa.component';
import { CreateEmpresaComponent } from './create-empresa/create-empresa.component';
import { EmpresasComponent } from './empresas.component';


@NgModule({
  declarations: [
    EmpresasComponent,
    ListEmpresaComponent,
    EditEmpresaComponent,
    DeleteEmpresaComponent,
    CreateEmpresaComponent
  ],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class EmpresasModule { }
