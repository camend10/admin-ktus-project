import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { CrearComponent } from './crear/crear.component';
import { ListarComponent } from './listar/listar.component';
import { EditarComponent } from './editar/editar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EliminarComponent } from './eliminar/eliminar.component';
import { VerPermisosComponent } from './ver-permisos/ver-permisos.component';

@NgModule({
  declarations: [
    RolesComponent,
    CrearComponent,
    ListarComponent,
    EditarComponent,
    EliminarComponent,
    VerPermisosComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class RolesModule { }
