import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ProveedoresComponent } from './proveedores.component';
import { ListProveedoresComponent } from './list-proveedores/list-proveedores.component';
import { CreateProveedorComponent } from './create-proveedor/create-proveedor.component';
import { EditProveedorComponent } from './edit-proveedor/edit-proveedor.component';
import { DeleteProveedorComponent } from './delete-proveedor/delete-proveedor.component';


@NgModule({
  declarations: [
    ProveedoresComponent,
    ListProveedoresComponent,
    CreateProveedorComponent,
    EditProveedorComponent,
    DeleteProveedorComponent
  ],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class ProveedoresModule { }
