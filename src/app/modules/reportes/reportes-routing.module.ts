import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './reportes.component';
import { BajaExistenciaComponent } from './baja-existencia/baja-existencia.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesComponent,
    children: [
      {
        path: 'baja-existencia',
        component: BajaExistenciaComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
