import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Movimiento, ResponseGestionMovimiento2, ResponseMovimiento2 } from '../../solicitudes/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  create(movimiento: Movimiento): Observable<ResponseGestionMovimiento2> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + "/movimientos";

    return this.http.post<ResponseGestionMovimiento2>(URL, movimiento).pipe(
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
    sede_id: number
  }): Observable<ResponseMovimiento2> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/movimientos/index?page=${page}`;

    return this.http.post<ResponseMovimiento2>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showMovimiento(id: number): Observable<ResponseGestionMovimiento2> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/movimientos/${id}`;

    return this.http.get<ResponseGestionMovimiento2>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  edit(movimiento: Movimiento, id: number): Observable<ResponseGestionMovimiento2> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/movimientos/${id}`;

    return this.http.put<ResponseGestionMovimiento2>(URL, movimiento).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(movimiento: Movimiento, nuevoEstado: number): Observable<ResponseGestionMovimiento2> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/movimientos/${movimiento.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionMovimiento2>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  entrada(data: { movimiento_id: number; deta_movi_ids: number[]; observacion_entrega: string }): Observable<ResponseGestionMovimiento2> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/movimientos/entrada`;

    return this.http.post<ResponseGestionMovimiento2>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
