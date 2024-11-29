import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { MetodoPago, ResponseGestionMetodoPago, ResponseMetodoPago } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(metodoPago: MetodoPago): Observable<ResponseGestionMetodoPago> {

    this.isLoadingSubject.next(true);

    let data = {
      nombre: metodoPago.nombre,
      empresa_id: metodoPago.empresa_id,
      metodo_pago_id: metodoPago.metodo_pago_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/metodo-pagos";

    return this.http.post<ResponseGestionMetodoPago>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(metodoPago: MetodoPago): Observable<ResponseGestionMetodoPago> {

    this.isLoadingSubject.next(true);

    let data = {
      id: metodoPago.id,
      nombre: metodoPago.nombre,
      empresa_id: metodoPago.empresa_id,
      metodo_pago_id: metodoPago.metodo_pago_id,
      estado: metodoPago.estado
    };


    let URL = URL_SERVICIOS + `/configuracion/metodo-pagos/${metodoPago.id}`;

    return this.http.put<ResponseGestionMetodoPago>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(metodoPago: MetodoPago, nuevoEstado: number): Observable<ResponseGestionMetodoPago> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/metodo-pagos/${metodoPago.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionMetodoPago>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseMetodoPago> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/metodo-pagos?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseMetodoPago>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
