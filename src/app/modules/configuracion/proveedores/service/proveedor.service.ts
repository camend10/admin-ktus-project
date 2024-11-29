import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { Proveedor, ResponseGestionProveedor, ResponseProveedor } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(proveedor: Proveedor, file_name: File | null): Observable<ResponseGestionProveedor> {

    this.isLoadingSubject.next(true);

    let formData = new FormData();
    formData.append('tipo_identificacion', proveedor.tipo_identificacion.toString());
    formData.append('identificacion', proveedor.identificacion.toString());
    formData.append('dv', proveedor.dv.toString());
    formData.append('nombres', proveedor.nombres);
    formData.append('apellidos', proveedor.apellidos);
    formData.append('email', proveedor.email);
    formData.append('direccion', proveedor.direccion);
    formData.append('celular', proveedor.celular.toString());
    formData.append('departamento_id', proveedor.departamento_id.toString());
    formData.append('municipio_id', proveedor.municipio_id.toString());
    formData.append('empresa_id', proveedor.empresa_id.toString());

    formData.append('estado', String(1));
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    let URL = URL_SERVICIOS + "/configuracion/proveedores";

    return this.http.post<ResponseGestionProveedor>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(proveedor: Proveedor, file_name: File | null): Observable<ResponseGestionProveedor> {

    this.isLoadingSubject.next(true);
    let formData = new FormData();
    formData.append('tipo_identificacion', proveedor.tipo_identificacion.toString());
    formData.append('identificacion', proveedor.identificacion.toString());
    formData.append('dv', proveedor.dv.toString());
    formData.append('nombres', proveedor.nombres);
    formData.append('apellidos', proveedor.apellidos);
    formData.append('email', proveedor.email);
    formData.append('direccion', proveedor.direccion);
    formData.append('celular', proveedor.celular.toString());
    formData.append('departamento_id', proveedor.departamento_id.toString());
    formData.append('municipio_id', proveedor.municipio_id.toString());
    formData.append('empresa_id', proveedor.empresa_id.toString());
    formData.append('estado', proveedor.estado.toString());
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    let URL = URL_SERVICIOS + `/configuracion/proveedores/${proveedor.id}`;

    return this.http.post<ResponseGestionProveedor>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(proveedor: Proveedor, nuevoEstado: number): Observable<ResponseGestionProveedor> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/proveedores/${proveedor.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionProveedor>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseProveedor> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/proveedores?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseProveedor>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
