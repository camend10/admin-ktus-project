import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'empresas',
    loadChildren: () => import('./empresas/empresas.module').then((m) => m.EmpresasModule),
  },
  {
    path: 'sedes',
    loadChildren: () => import('./sedes/sedes.module').then((m) => m.SedesModule),
  },
  {
    path: 'bodegas',
    loadChildren: () => import('./bodegas/bodegas.module').then((m) => m.BodegasModule),
  },
  {
    path: 'lugar-de-entrega',
    loadChildren: () => import('./sede-deliveries/sede-deliveries.module').then((m) => m.SedeDeliveriesModule),
  },
  {
    path: 'metodos-de-pagos',
    loadChildren: () => import('./metodo-pagos/metodo-pagos.module').then((m) => m.MetodoPagosModule),
  },
  {
    path: 'segmento-de-clientes',
    loadChildren: () => import('./segmento-clientes/segmento-clientes.module').then((m) => m.SegmentoClientesModule),
  },
  {
    path: 'categorias',
    loadChildren: () => import('./categorias/categorias.module').then((m) => m.CategoriasModule),
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./proveedores/proveedores.module').then((m) => m.ProveedoresModule),
  },
  {
    path: 'unidades',
    loadChildren: () => import('./unidades/unidades.module').then((m) => m.UnidadesModule),
  },
  {
    path: 'iva',
    loadChildren: () => import('./ivas/ivas.module').then((m) => m.IvasModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
