import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodegasComponent } from './bodegas.component';
import { ListBodegasComponent } from './list-bodegas/list-bodegas.component';

const routes: Routes = [
  {
    path: '',
    component: BodegasComponent,
    children: [
      {
        path: 'list',
        component: ListBodegasComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BodegasRoutingModule { }
