import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';

import { PlantillasRoutingModule } from './plantillas-routing.module';
import { ListPlantillasComponent } from './list-plantillas/list-plantillas.component';
import { CreatePlantillaComponent } from './create-plantilla/create-plantilla.component';
import { EditPlantillaComponent } from './edit-plantilla/edit-plantilla.component';
import { DeletePlantillaComponent } from './delete-plantilla/delete-plantilla.component';
import { EditDetallePlantillaComponent } from './componentes/edit-detalle-plantilla/edit-detalle-plantilla.component';
import { DeleteDetallePlantillaComponent } from './componentes/delete-detalle-plantilla/delete-detalle-plantilla.component';
import { PlantillasComponent } from './plantillas.component';


@NgModule({
  declarations: [
    PlantillasComponent,
    ListPlantillasComponent,
    CreatePlantillaComponent,
    EditPlantillaComponent,
    DeletePlantillaComponent,
    EditDetallePlantillaComponent,
    DeleteDetallePlantillaComponent
  ],
  imports: [
    CommonModule,
    PlantillasRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    SharedModule
  ]
})
export class PlantillasModule { }
