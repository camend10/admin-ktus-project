import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimientosComponent } from './movimientos.component';
import { ListMovimientosComponent } from './list-movimientos/list-movimientos.component';
import { CreateMovimientoComponent } from './create-movimiento/create-movimiento.component';
import { EditMovimientoComponent } from './edit-movimiento/edit-movimiento.component';

const routes: Routes = [
  {
    path: '',
    component: MovimientosComponent,
    children: [
      {
        path: 'registrar',
        component: CreateMovimientoComponent,
      },
      {
        path: 'listado',
        component: ListMovimientosComponent,
      },
      {
        path: 'listado/editar/:id',
        component: EditMovimientoComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
