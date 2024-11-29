import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticulosComponent } from './articulos.component';
import { ListArticuloComponent } from './list-articulo/list-articulo.component';
import { CreateArticuloComponent } from './create-articulo/create-articulo.component';
import { EditArticuloComponent } from './edit-articulo/edit-articulo.component';

const routes: Routes = [
  {
    path: '',
    component: ArticulosComponent,
    children: [
      {
        path: 'list',
        component: ListArticuloComponent
      },
      {
        path: 'registrar',
        component: CreateArticuloComponent
      },
      {
        path: 'list/editar/:id',
        component: EditArticuloComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticulosRoutingModule { }
