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
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
