import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturasComponent } from './facturas.component';
import { CreateFacturaComponent } from './create-factura/create-factura.component';
import { ListFacturasComponent } from './list-facturas/list-facturas.component';
import { EditFacturaComponent } from './edit-factura/edit-factura.component';

const routes: Routes = [
  {
    path: '',
    component: FacturasComponent,
    children: [
      {
        path: 'crear',
        component: CreateFacturaComponent,
      },
      {
        path: 'listado',
        component: ListFacturasComponent,
      },
      {
        path: 'listado/editar/:id',
        component: EditFacturaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasRoutingModule { }
