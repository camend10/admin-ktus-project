import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnidadesComponent } from './unidades.component';
import { ListUnidadesComponent } from './list-unidades/list-unidades.component';

const routes: Routes = [
  {
    path: '',
    component: UnidadesComponent,
    children: [
      {
        path: 'list',
        component: ListUnidadesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadesRoutingModule { }
