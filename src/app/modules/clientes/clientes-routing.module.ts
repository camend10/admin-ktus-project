import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ListClientesComponent } from './list-clientes/list-clientes.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesComponent,
    children: [
      {
        path: 'list',
        component: ListClientesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
