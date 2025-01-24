import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { Empresa, ResponseEmpresa, ResponseGestionEmpresa } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(empresa: Empresa, file_name: File | null): Observable<any> {

    this.isLoadingSubject.next(true);

    let formData = new FormData();

    formData.append('nit_empresa', empresa.nit_empresa);
    formData.append('dv', empresa.dv);
    formData.append('nombre', empresa.nombre);
    formData.append('email', empresa.email);
    formData.append('direccion', empresa.direccion);
    formData.append('telefono', empresa.telefono.toString());
    formData.append('web', empresa.web);
    formData.append('celular', empresa.celular.toString());
    formData.append('departamento_id', empresa.departamento_id.toString());
    formData.append('municipio_id', empresa.municipio_id.toString());
    formData.append('estado', String(1));
    formData.append('lema', empresa.lema || '');
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }


    let URL = URL_SERVICIOS + "/configuracion/empresas";

    return this.http.post<ResponseGestionEmpresa>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(empresa: Empresa, file_name: File | null): Observable<ResponseGestionEmpresa> {

    this.isLoadingSubject.next(true);


    let formData = new FormData();

    formData.append('id', empresa.id.toString());
    formData.append('nit_empresa', empresa.nit_empresa);
    formData.append('dv', empresa.dv);
    formData.append('nombre', empresa.nombre);
    formData.append('email', empresa.email);
    formData.append('direccion', empresa.direccion);
    formData.append('telefono', empresa.telefono.toString());
    formData.append('web', empresa.web);
    formData.append('celular', empresa.celular.toString());
    formData.append('departamento_id', empresa.departamento_id.toString());
    formData.append('municipio_id', empresa.municipio_id.toString());
    formData.append('estado', empresa.estado.toString());
    formData.append('lema', empresa.lema || '');
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    let URL = URL_SERVICIOS + `/configuracion/empresas/${empresa.id}`;

    return this.http.post<ResponseGestionEmpresa>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(empresa: Empresa, nuevoEstado: number): Observable<ResponseGestionEmpresa> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/empresas/${empresa.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionEmpresa>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseEmpresa> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/empresas?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseEmpresa>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
