import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { ResponseGestionSede, ResponseSede, Sede } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(sede: Sede): Observable<any> {

    this.isLoadingSubject.next(true);

    let data = {
      codigo: sede.codigo,
      nombre: sede.nombre,
      direccion: sede.direccion,
      telefono: sede.telefono,
      celular: sede.celular,
      responsable: sede.responsable,
      telefono_responsable: sede.telefono_responsable,
      identificacion_responsable: sede.identificacion_responsable,
      empresa_id: sede.empresa_id,
      departamento_id: sede.departamento_id,
      municipio_id: sede.municipio_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/sedes";

    return this.http.post<ResponseGestionSede>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(sede: Sede): Observable<ResponseGestionSede> {

    this.isLoadingSubject.next(true);

    let data = {
      id: sede.id,
      codigo: sede.codigo,
      nombre: sede.nombre,
      direccion: sede.direccion,
      telefono: sede.telefono,
      celular: sede.celular,
      responsable: sede.responsable,
      telefono_responsable: sede.telefono_responsable,
      identificacion_responsable: sede.identificacion_responsable,
      empresa_id: sede.empresa_id,
      departamento_id: sede.departamento_id,
      municipio_id: sede.municipio_id,
      estado: sede.estado
    };


    let URL = URL_SERVICIOS + `/configuracion/sedes/${sede.id}`;

    return this.http.put<ResponseGestionSede>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(sede: Sede, nuevoEstado: number): Observable<ResponseGestionSede> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/sedes/${sede.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionSede>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseSede> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/sedes?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseSede>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
