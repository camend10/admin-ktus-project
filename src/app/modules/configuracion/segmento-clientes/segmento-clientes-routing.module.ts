import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SegmentoClientesComponent } from './segmento-clientes.component';
import { ListSegmentoClientesComponent } from './list-segmento-clientes/list-segmento-clientes.component';

const routes: Routes = [
  {
    path: '',
    component: SegmentoClientesComponent,
    children: [
      {
        path: 'list',
        component: ListSegmentoClientesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SegmentoClientesRoutingModule { }
