import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { Conversion, ResponseConversion, ResponseGestionConversion } from '../interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ConversionesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(conversion: Conversion): Observable<ResponseGestionConversion> {

    this.isLoadingSubject.next(true);

    let data = {
      id: 0,
      articulo_id: Number(conversion.articulo_id),
      bodega_id: Number(conversion.bodega_id),
      unidad_inicio_id: Number(conversion.unidad_inicio_id),
      unidad_final_id: Number(conversion.unidad_final_id),
      user_id: Number(conversion.user_id),
      empresa_id: Number(conversion.empresa_id),
      sede_id: Number(conversion.sede_id),
      estado: 1,
      cantidad_inicial: Number(conversion.cantidad_inicial),
      cantidad_final: Number(conversion.cantidad_final),
      cantidad_convertida: Number(conversion.cantidad_convertida),
      descripcion: conversion.descripcion,
    };

    let URL = URL_SERVICIOS + "/conversiones";

    return this.http.post<ResponseGestionConversion>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(conversion: Conversion, nuevoEstado: number): Observable<ResponseGestionConversion> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/conversiones/${conversion.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionConversion>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1,
    data:
      {
        buscar: string;
        bodega_id: number;
        unidad_inicio_id: number;
        unidad_final_id: number;
        fecha_inicio: string,
        fecha_final: string,
        articulo: string;
      }): Observable<ResponseConversion> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/conversiones/index?page=${page}`;

    return this.http.post<ResponseConversion>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
