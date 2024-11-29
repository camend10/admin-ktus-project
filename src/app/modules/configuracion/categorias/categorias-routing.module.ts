import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { ListCategoriasComponent } from './list-categorias/list-categorias.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriasComponent,
    children: [
      {
        path: 'list',
        component: ListCategoriasComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
