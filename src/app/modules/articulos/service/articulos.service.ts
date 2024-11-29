import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { Articulo, ArticuloWallet, BodegaArticulo, Especificacion, ResponseArticulo, ResponseGestionArticulo } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  registrar(articulo: Articulo, file_name: File | null, bodegas_articulos: BodegaArticulo[],
    articulos_wallets: ArticuloWallet[], especificaciones: Especificacion[]): Observable<ResponseGestionArticulo> {

    this.isLoadingSubject.next(true);

    let formData = new FormData();

    formData.append('nombre', articulo.nombre);
    formData.append('descripcion', articulo.descripcion);
    formData.append('estado', articulo.estado.toString());
    formData.append('categoria_id', articulo.categoria_id.toString());
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }
    formData.append('precio_general', articulo.precio_general.toString());
    formData.append('disponibilidad', articulo.disponibilidad.toString());
    formData.append('tiempo_de_abastecimiento', articulo.tiempo_de_abastecimiento.toString());
    formData.append('is_discount', articulo.is_discount.toString());
    formData.append('descuento_minimo', articulo.descuento_minimo.toString());
    formData.append('descuento_maximo', articulo.descuento_maximo.toString());
    formData.append('iva_id', articulo.iva_id.toString());

    formData.append('sku', articulo.sku);
    formData.append('is_gift', articulo.is_gift.toString());
    formData.append('peso', articulo.peso !== undefined ? articulo.peso.toString() : '');
    formData.append('ancho', articulo.ancho !== undefined ? articulo.ancho.toString() : '');
    formData.append('alto', articulo.alto !== undefined ? articulo.alto.toString() : '');
    formData.append('largo', articulo.largo !== undefined ? articulo.largo.toString() : '');

    formData.append('bodegas_articulos', JSON.stringify(bodegas_articulos));
    formData.append('articulos_wallets', JSON.stringify(articulos_wallets));

    formData.append('empresa_id', articulo.empresa_id.toString());

    formData.append('punto_pedido', articulo.punto_pedido.toString());
    formData.append('punto_pedido_unidad_id', articulo.punto_pedido_unidad_id.toString());
    formData.append('impuesto', articulo.impuesto.toString());
    formData.append('proveedor_id', articulo.proveedor_id ? articulo.proveedor_id.toString() : '9999999');
    formData.append('especificaciones', JSON.stringify(especificaciones));

    let URL = URL_SERVICIOS + "/articulos";

    return this.http.post<ResponseGestionArticulo>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, data: { buscar: string; categoria_id: number; impuesto: number, sede_id: number, bodega_id: number, segmento_cliente_id: number, unidad_id_bodegas: number, proveedor_id: number }): Observable<ResponseArticulo> {
    this.isLoadingSubject.next(true);

    const params = {
      buscar: data.buscar,
      categoria_id: data.categoria_id.toString(),
      impuesto: data.impuesto.toString(),
      sede_id: data.sede_id.toString(),
      bodega_id: data.bodega_id.toString(),
      segmento_cliente_id: data.segmento_cliente_id.toString(),
      unidad_id_bodegas: data.unidad_id_bodegas.toString(),
      proveedor_id: data.proveedor_id.toString(),
    };

    let URL = URL_SERVICIOS + `/articulos/index?page=${page}`;

    return this.http.post<ResponseArticulo>(URL, params).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showArticulo(id: number): Observable<ResponseGestionArticulo> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/articulos/${id}`;

    return this.http.get<ResponseGestionArticulo>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(articulo: Articulo, file_name: File | null, bodegas_articulos: BodegaArticulo[],
    articulos_wallets: ArticuloWallet[], especificaciones: Especificacion[]): Observable<ResponseGestionArticulo> {

    this.isLoadingSubject.next(true);

    let formData = new FormData();

    formData.append('nombre', articulo.nombre);
    formData.append('descripcion', articulo.descripcion);
    formData.append('estado', articulo.estado.toString());
    formData.append('categoria_id', articulo.categoria_id.toString());
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }
    formData.append('precio_general', articulo.precio_general.toString());
    formData.append('disponibilidad', articulo.disponibilidad.toString());
    formData.append('tiempo_de_abastecimiento', articulo.tiempo_de_abastecimiento.toString());
    formData.append('is_discount', articulo.is_discount.toString());
    formData.append('descuento_minimo', articulo.descuento_minimo.toString());
    formData.append('descuento_maximo', articulo.descuento_maximo.toString());
    formData.append('iva_id', articulo.iva_id.toString());

    formData.append('sku', articulo.sku);
    formData.append('is_gift', articulo.is_gift.toString());
    formData.append('peso', articulo.peso !== undefined ? articulo.peso.toString() : '');
    formData.append('ancho', articulo.ancho !== undefined ? articulo.ancho.toString() : '');
    formData.append('alto', articulo.alto !== undefined ? articulo.alto.toString() : '');
    formData.append('largo', articulo.largo !== undefined ? articulo.largo.toString() : '');

    formData.append('empresa_id', articulo.empresa_id.toString());

    formData.append('punto_pedido', articulo.punto_pedido.toString());
    formData.append('punto_pedido_unidad_id', articulo.punto_pedido_unidad_id.toString());
    formData.append('impuesto', articulo.impuesto.toString());
    formData.append('proveedor_id', articulo.proveedor_id ? articulo.proveedor_id.toString() : '9999999');
    formData.append('especificaciones', JSON.stringify(especificaciones));


    let URL = URL_SERVICIOS + `/articulos/${articulo.id}`;

    return this.http.post<ResponseGestionArticulo>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  cambiarEstado(articulo: Articulo, nuevoEstado: number): Observable<ResponseGestionArticulo> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/articulos/${articulo.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionArticulo>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
