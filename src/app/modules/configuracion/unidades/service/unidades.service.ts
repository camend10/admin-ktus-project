import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { ResponseGestionUnidad, ResponseGestionUnidadTransformacion, ResponseUnidad, Unidad, UnidadTransformacion } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(unidad: Unidad): Observable<ResponseGestionUnidad> {

    this.isLoadingSubject.next(true);

    let data = {
      nombre: unidad.nombre,
      sigla: unidad.sigla,
      descripcion: unidad.descripcion,
      empresa_id: unidad.empresa_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/unidades";

    return this.http.post<ResponseGestionUnidad>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(unidad: Unidad): Observable<ResponseGestionUnidad> {

    this.isLoadingSubject.next(true);

    let data = {
      id: unidad.id,
      nombre: unidad.nombre,
      sigla: unidad.sigla,
      descripcion: unidad.descripcion,
      empresa_id: unidad.empresa_id,
      estado: unidad.estado
    };

    let URL = URL_SERVICIOS + `/configuracion/unidades/${unidad.id}`;

    return this.http.put<ResponseGestionUnidad>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(unidad: Unidad, nuevoEstado: number): Observable<ResponseGestionUnidad> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/unidades/${unidad.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionUnidad>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseUnidad> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/unidades?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseUnidad>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  registrarTransformacion(unidadTransformacion: UnidadTransformacion): Observable<ResponseGestionUnidadTransformacion> {

    this.isLoadingSubject.next(true);

    let data = {
      unidad_id: unidadTransformacion.unidad_id,
      unidad_to_id: unidadTransformacion.unidad_to_id,
      empresa_id: unidadTransformacion.empresa_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/unidades/add-transformacion";

    return this.http.post<ResponseGestionUnidadTransformacion>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteTransformacion(unidadTransformacion: UnidadTransformacion): Observable<ResponseGestionUnidadTransformacion> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/unidades/delete-transformacion/${unidadTransformacion.id}`;

    return this.http.delete<ResponseGestionUnidadTransformacion>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
