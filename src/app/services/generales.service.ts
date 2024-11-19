import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { Departamento, Genero, Municipio, TipoDoc, Role, Empresa, ResponseConfiguracion } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeneralesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    public http: HttpClient) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  cargarDepartamentos(): Observable<{ departamentos: Departamento[] }> {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + '/generales/departamentos';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post<{ departamentos: Departamento[] }>(url, data)
      .pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  cargarMunicipios(): Observable<{ municipios: Municipio[] }> {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + '/generales/municipios';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post<{ municipios: Municipio[] }>(url, data)
      .pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  cargarTipoDocumentos(): Observable<{ tipodocumentos: TipoDoc[] }> {
    this.isLoadingSubject.next(true);
    const url = URL_SERVICIOS + '/generales/tipo-documentos';

    const data = {
      txtbusqueda: ''
    };

    return this.http.post<{ tipodocumentos: TipoDoc[] }>(url, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cargarGeneros(): Observable<{ generos: Genero[] }> {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + '/generales/generos';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post<{ generos: Genero[] }>(url, data)
      .pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  cargarRoles(): Observable<{ roles: Role[] }> {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + '/generales/roles';

    let data = {
      txtbusqueda: ''
    };

    return this.http.post<{ roles: Role[] }>(url, data)
      .pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  cargarEmpresas(empresa_id: number): Observable<{ empresas: Empresa[] }> {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + '/generales/empresas';

    let data = {
      empresa_id: empresa_id
    };

    return this.http.post<{ empresas: Empresa[] }>(url, data)
      .pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  cargarConfiguraciones(empresa_id: number): Observable<ResponseConfiguracion> {
    this.isLoadingSubject.next(true);
    let url = URL_SERVICIOS + '/generales/configuraciones';

    let data = {
      empresa_id: empresa_id
    };

    return this.http.post<ResponseConfiguracion>(url, data)
      .pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
  }
}
