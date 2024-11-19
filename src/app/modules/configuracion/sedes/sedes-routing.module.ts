import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SedesComponent } from './sedes.component';
import { ListSedeComponent } from './list-sede/list-sede.component';

const routes: Routes = [
  {
    path: '',
    component: SedesComponent,
    children: [
      {
        path: 'list',
        component: ListSedeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SedesRoutingModule { }
