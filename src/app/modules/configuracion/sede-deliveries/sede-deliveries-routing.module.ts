import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SedeDeliveriesComponent } from './sede-deliveries.component';
import { ListSedeDeliverieComponent } from './list-sede-deliverie/list-sede-deliverie.component';

const routes: Routes = [
  {
    path: '',
    component: SedeDeliveriesComponent,
    children: [
      {
        path: 'list',
        component: ListSedeDeliverieComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SedeDeliveriesRoutingModule { }
