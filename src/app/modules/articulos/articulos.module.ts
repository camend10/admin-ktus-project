import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticulosRoutingModule } from './articulos-routing.module';
import { ListArticuloComponent } from './list-articulo/list-articulo.component';
import { ArticulosComponent } from './articulos.component';
import { CreateArticuloComponent } from './create-articulo/create-articulo.component';
import { EditArticuloComponent } from './edit-articulo/edit-articulo.component';
import { DeleteArticuloComponent } from './delete-articulo/delete-articulo.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { EditBodegaArticuloComponent } from './bodega/edit-bodega-articulo/edit-bodega-articulo.component';
import { DeleteBodegaArticuloComponent } from './bodega/delete-bodega-articulo/delete-bodega-articulo.component';
import { EditWalletPriceComponent } from './wallet/edit-wallet-price/edit-wallet-price.component';
import { DeleteWalletPriceComponent } from './wallet/delete-wallet-price/delete-wallet-price.component';


@NgModule({
  declarations: [
    ArticulosComponent,
    ListArticuloComponent,
    CreateArticuloComponent,
    EditArticuloComponent,
    DeleteArticuloComponent,
    EditBodegaArticuloComponent,
    DeleteBodegaArticuloComponent,
    EditWalletPriceComponent,
    DeleteWalletPriceComponent
  ],
  imports: [
    CommonModule,
    ArticulosRoutingModule,
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
export class ArticulosModule { }
