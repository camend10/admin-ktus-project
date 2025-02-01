import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ResponseArticulo } from '../../articulos/interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ResponseFactura } from '../../facturas/interfaces';
import { ResponseMovimiento, ResponseReporte } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  baja_existencia(page = 1, data: { buscar: string; categoria_id: number; sede_id: number, bodega_id: number, unidad_id_bodegas: number, proveedor_id: number, state_stock: number }): Observable<ResponseArticulo> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/reportes/baja-existencia?page=${page}`;

    return this.http.post<ResponseArticulo>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventas(page = 1,
    data: {
      segmento_cliente_id: number;
      categoria_id: number,
      vendedor_id: number,
      fecha_inicio: string,
      fecha_final: string,
      sede_id: number,
      metodo_pago_id: number,
      sede_usuario_id: number,
    }
  ): Observable<ResponseFactura> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/reportes/ventas?page=${page}`;

    return this.http.post<ResponseFactura>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  vendidos(page = 1, data: {
    categoria_id: number;
    sede_id: number,
    proveedor_id: number,
    fecha_inicio: string,
    fecha_final: string,
    vendedor_id: number,
  }): Observable<ResponseReporte> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/reportes/vendidos?page=${page}`;

    return this.http.post<ResponseReporte>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  movimientos(
    data: {
      sede_id: number,
      bodega_id: number,
      fecha_inicio: string,
      fecha_final: string,
      articulo: string;
    }): Observable<ResponseMovimiento> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/reportes/movimientos`;

    return this.http.post<ResponseMovimiento>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
