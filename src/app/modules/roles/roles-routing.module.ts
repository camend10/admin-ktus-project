import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { components } from 'src/app/_metronic/kt';
import { ListarComponent } from './listar/listar.component';

const routes: Routes = [

  {
    path: '',
    component: RolesComponent,
    children: [
      {
        path: 'listar',
        component: ListarComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
