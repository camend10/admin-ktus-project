import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Movimiento, ResponseGestionMovimiento, ResponseMovimiento } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  create(movimiento: Movimiento): Observable<ResponseGestionMovimiento> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + "/solicitudes";

    return this.http.post<ResponseGestionMovimiento>(URL, movimiento).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, data: {
    buscar: string;
    bodega_id: number;
    usuario_id: number;
    proveedor_id: number;
    fecha_inicio: string,
    fecha_final: string,
    articulo: string,
    sede_id: number,
  }): Observable<ResponseMovimiento> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/solicitudes/index?page=${page}`;

    return this.http.post<ResponseMovimiento>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showMovimiento(id: number): Observable<ResponseGestionMovimiento> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/solicitudes/${id}`;

    return this.http.get<ResponseGestionMovimiento>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  edit(movimiento: Movimiento, id: number): Observable<ResponseGestionMovimiento> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/solicitudes/${id}`;

    return this.http.put<ResponseGestionMovimiento>(URL, movimiento).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(movimiento: Movimiento, nuevoEstado: number): Observable<ResponseGestionMovimiento> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/solicitudes/${movimiento.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionMovimiento>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  entregar(data: { movimiento_id: number; deta_movi_ids: number[]; observacion_entrega: string }): Observable<ResponseGestionMovimiento> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/solicitudes/entrega`;

    return this.http.post<ResponseGestionMovimiento>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
