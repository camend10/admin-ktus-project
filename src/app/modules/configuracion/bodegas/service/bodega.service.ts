import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { Bodega, ResponseBodega, ResponseGestionBodega } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class BodegaService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(bodega: Bodega): Observable<ResponseGestionBodega> {

    this.isLoadingSubject.next(true);

    let data = {
      nombre: bodega.nombre,
      descripcion: bodega.descripcion,
      empresa_id: bodega.empresa_id,
      sede_id: bodega.sede_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/bodegas";

    return this.http.post<ResponseGestionBodega>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(bodega: Bodega): Observable<ResponseGestionBodega> {

    this.isLoadingSubject.next(true);

    let data = {
      id: bodega.id,
      nombre: bodega.nombre,
      descripcion: bodega.descripcion,
      empresa_id: bodega.empresa_id,
      sede_id: bodega.sede_id,
      estado: bodega.estado
    };


    let URL = URL_SERVICIOS + `/configuracion/bodegas/${bodega.id}`;

    return this.http.put<ResponseGestionBodega>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(bodega: Bodega, nuevoEstado: number): Observable<ResponseGestionBodega> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/bodegas/${bodega.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionBodega>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseBodega> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/bodegas?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseBodega>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
