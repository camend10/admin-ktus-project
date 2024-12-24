import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantillasComponent } from './plantillas.component';
import { ListPlantillasComponent } from './list-plantillas/list-plantillas.component';
import { CreatePlantillaComponent } from './create-plantilla/create-plantilla.component';
import { EditPlantillaComponent } from './edit-plantilla/edit-plantilla.component';

const routes: Routes = [
  {
    path: '',
    component: PlantillasComponent,
    children: [
      {
        path: 'listado',
        component: ListPlantillasComponent,
      },
      {
        path: 'registrar',
        component: CreatePlantillaComponent,
      },
      {
        path: 'listado/editar/:id',
        component: EditPlantillaComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantillasRoutingModule { }
