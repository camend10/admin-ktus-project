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

  registrar(empresa: Empresa): Observable<any> {

    this.isLoadingSubject.next(true);
    
    let data = {
      nit_empresa: empresa.nit_empresa,
      dv: empresa.dv,
      nombre: empresa.nombre,
      email: empresa.email,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      web: empresa.web,
      celular: empresa.celular,
      departamento_id: empresa.departamento_id,
      municipio_id: empresa.municipio_id,
      estado: 1,

    };

    let URL = URL_SERVICIOS + "/configuracion/empresas";

    return this.http.post<ResponseGestionEmpresa>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(empresa: Empresa): Observable<ResponseGestionEmpresa> {

    this.isLoadingSubject.next(true);

    let data = {
      id: empresa.id,
      nit_empresa: empresa.nit_empresa,
      dv: empresa.dv,
      nombre: empresa.nombre,
      email: empresa.email,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      web: empresa.web,
      celular: empresa.celular,
      departamento_id: empresa.departamento_id,
      municipio_id: empresa.municipio_id,
      estado: empresa.estado
    };


    let URL = URL_SERVICIOS + `/configuracion/empresas/${empresa.id}`;

    return this.http.put<ResponseGestionEmpresa>(URL, data).pipe(
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
