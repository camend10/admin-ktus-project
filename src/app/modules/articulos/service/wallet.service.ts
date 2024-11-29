import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { BodegaArticulo, ResponseGestionArticuloWallet, ResponseGestionBodegaArticulo } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(data: { articulo_id: number, segmento_cliente_id: number, unidad_id: number, precio: number, sede_id: number }): Observable<ResponseGestionArticuloWallet> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + "/articulos-wallets";

    return this.http.post<ResponseGestionArticuloWallet>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(id: number, data: { id: number, articulo_id: number, segmento_cliente_id: number, unidad_id: number, precio: number, sede_id: number }): Observable<ResponseGestionArticuloWallet> {

    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS + `/articulos-wallets/${id}`;

    return this.http.put<ResponseGestionArticuloWallet>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  delete(id: number): Observable<ResponseGestionArticuloWallet> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/articulos-wallets/${id}`;

    return this.http.delete<ResponseGestionArticuloWallet>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
