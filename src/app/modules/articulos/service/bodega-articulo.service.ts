import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { BodegaArticulo, ResponseGestionBodegaArticulo } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BodegaArticuloService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(data: { articulo_id: number, bodega_id: number, unidad_id: number, cantidad: number }): Observable<ResponseGestionBodegaArticulo> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + "/bodegas-articulos";

    return this.http.post<ResponseGestionBodegaArticulo>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(id: number, data: { id: number, articulo_id: number, bodega_id: number, unidad_id: number, cantidad: number }): Observable<ResponseGestionBodegaArticulo> {

    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/bodegas-articulos/${id}`;

    return this.http.put<ResponseGestionBodegaArticulo>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  delete(id: number): Observable<ResponseGestionBodegaArticulo> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/bodegas-articulos/${id}`;

    return this.http.delete<ResponseGestionBodegaArticulo>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
