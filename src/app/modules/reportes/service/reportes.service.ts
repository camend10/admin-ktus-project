import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { ResponseArticulo } from '../../articulos/interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';

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
}
