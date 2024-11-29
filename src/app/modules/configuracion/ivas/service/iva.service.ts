import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { Iva, ResponseGestionIva, ResponseIva } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class IvaService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(iva: Iva): Observable<ResponseGestionIva> {

    this.isLoadingSubject.next(true);

    let data = {
      porcentaje: iva.porcentaje,
      empresa_id: iva.empresa_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/iva";

    return this.http.post<ResponseGestionIva>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(iva: Iva): Observable<ResponseGestionIva> {

    this.isLoadingSubject.next(true);

    let data = {
      id: iva.id,
      porcentaje: iva.porcentaje,
      empresa_id: iva.empresa_id,
      estado: 1
    };


    let URL = URL_SERVICIOS + `/configuracion/iva/${iva.id}`;

    return this.http.put<ResponseGestionIva>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(iva: Iva, nuevoEstado: number): Observable<ResponseGestionIva> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/iva/${iva.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionIva>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseIva> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/iva?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseIva>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
