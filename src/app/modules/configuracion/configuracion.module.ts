import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SedesModule } from './sedes/sedes.module';
import { EmpresasModule } from './empresas/empresas.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    SedesModule,
    EmpresasModule
  ]
})
export class ConfiguracionModule { }
