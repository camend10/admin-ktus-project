import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes.component';
import { CreateSolicitudComponent } from './create-solicitud/create-solicitud.component';
import { ListSolicitudesComponent } from './list-solicitudes/list-solicitudes.component';
import { EditSolicitudComponent } from './edit-solicitud/edit-solicitud.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesComponent,
    children: [
      {
        path: 'registrar',
        component: CreateSolicitudComponent,
      },
      {
        path: 'listado',
        component: ListSolicitudesComponent,
      },
      {
        path: 'listado/editar/:id',
        component: EditSolicitudComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
