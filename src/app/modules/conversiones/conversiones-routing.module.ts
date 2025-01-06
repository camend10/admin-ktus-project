import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversionesComponent } from './conversiones.component';
import { ListConversionesComponent } from './list-conversiones/list-conversiones.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionesComponent,
    children: [
      {
        path: 'listado',
        component: ListConversionesComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversionesRoutingModule { }
