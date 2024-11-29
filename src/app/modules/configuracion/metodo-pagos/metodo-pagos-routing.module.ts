import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetodoPagosComponent } from './metodo-pagos.component';
import { ListMetodoPagosComponent } from './list-metodo-pagos/list-metodo-pagos.component';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagosComponent,
    children: [
      {
        path: 'list',
        component: ListMetodoPagosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetodoPagosRoutingModule { }
