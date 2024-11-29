import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { ResponseGestionSegmentoCliente, ResponseSegmentoCliente, SegmentoCliente } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SegmentoClienteService {
  
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(segmentoCliente: SegmentoCliente): Observable<ResponseGestionSegmentoCliente> {

    this.isLoadingSubject.next(true);

    let data = {
      nombre: segmentoCliente.nombre,
      empresa_id: segmentoCliente.empresa_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/segmento_cliente";

    return this.http.post<ResponseGestionSegmentoCliente>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(segmentoCliente: SegmentoCliente): Observable<ResponseGestionSegmentoCliente> {

    this.isLoadingSubject.next(true);

    let data = {
      id: segmentoCliente.id,
      nombre: segmentoCliente.nombre,
      empresa_id: segmentoCliente.empresa_id,
      estado: segmentoCliente.estado
    };


    let URL = URL_SERVICIOS + `/configuracion/segmento_cliente/${segmentoCliente.id}`;

    return this.http.put<ResponseGestionSegmentoCliente>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(segmentoCliente: SegmentoCliente, nuevoEstado: number): Observable<ResponseGestionSegmentoCliente> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/segmento_cliente/${segmentoCliente.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionSegmentoCliente>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseSegmentoCliente> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/segmento_cliente?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseSegmentoCliente>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
