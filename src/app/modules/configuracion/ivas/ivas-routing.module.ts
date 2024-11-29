import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IvasComponent } from './ivas.component';
import { ListIvasComponent } from './list-ivas/list-ivas.component';

const routes: Routes = [
  {
    path: '',
    component: IvasComponent,
    children: [
      {
        path: 'list',
        component: ListIvasComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IvasRoutingModule { }
