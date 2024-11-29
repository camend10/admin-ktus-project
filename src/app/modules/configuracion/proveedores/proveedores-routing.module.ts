import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';
import { ListProveedoresComponent } from './list-proveedores/list-proveedores.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedoresComponent,
    children: [
      {
        path: 'list',
        component: ListProveedoresComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
