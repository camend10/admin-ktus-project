import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { SedesModule } from './sedes/sedes.module';
import { EmpresasModule } from './empresas/empresas.module';
import { BodegasModule } from './bodegas/bodegas.module';
import { SedeDeliveriesModule } from './sede-deliveries/sede-deliveries.module';
import { MetodoPagosModule } from './metodo-pagos/metodo-pagos.module';
import { SegmentoClientesModule } from './segmento-clientes/segmento-clientes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { UnidadesModule } from './unidades/unidades.module';
import { IvasModule } from './ivas/ivas.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    SedesModule,
    EmpresasModule,
    BodegasModule,
    SedeDeliveriesModule,
    MetodoPagosModule,
    SegmentoClientesModule,
    CategoriasModule,
    ProveedoresModule,
    UnidadesModule,
    IvasModule
  ]
})
export class ConfiguracionModule { }
