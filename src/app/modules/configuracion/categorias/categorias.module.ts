import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasRoutingModule } from './categorias-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CategoriasComponent } from './categorias.component';
import { ListCategoriasComponent } from './list-categorias/list-categorias.component';
import { CreateCategoriaComponent } from './create-categoria/create-categoria.component';
import { EditCategoriaComponent } from './edit-categoria/edit-categoria.component';
import { DeleteCategoriaComponent } from './delete-categoria/delete-categoria.component';


@NgModule({
  declarations: [
    CategoriasComponent,
    ListCategoriasComponent,
    CreateCategoriaComponent,
    EditCategoriaComponent,
    DeleteCategoriaComponent
  ],
  imports: [
    CommonModule,
    CategoriasRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class CategoriasModule { }
