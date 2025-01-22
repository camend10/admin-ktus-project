import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ResponseGestionUsers, ResponseUser, User } from '../interfaces';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrarUser(user: User, file_name: File | null, sedes: number[]): Observable<ResponseGestionUsers> {

    this.isLoadingSubject.next(true);

    let formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('identificacion', user.identificacion);
    formData.append('direccion', user.direccion);
    formData.append('usuario', user.usuario);
    formData.append('password', user.password ?? '12345678');
    formData.append('celular', user.celular.toString());
    formData.append('empresa_id', user.empresa_id.toString());
    formData.append('role_id', user.role_id.toString());
    formData.append('genero_id', user.genero_id.toString());
    formData.append('departamento_id', user.departamento_id.toString());
    formData.append('municipio_id', user.municipio_id.toString());
    formData.append('tipo_doc_id', user.tipo_doc_id.toString());
    formData.append('estado', String(1));
    // formData.append('fecha_nacimiento', user.fecha_nacimiento ? user.fecha_nacimiento.toISOString() : '');
    formData.append('fecha_nacimiento', user.fecha_nacimiento ? user.fecha_nacimiento : '');
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    // Agregar cada sede seleccionada al FormData
    sedes.forEach((sede_id) => {
      formData.append('sedes[]', sede_id.toString());
    });

    let URL = URL_SERVICIOS + "/configuracion/users";

    return this.http.post<ResponseGestionUsers>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editarUsuario(user: User, file_name: File | null, sedes: number[]): Observable<ResponseGestionUsers> {

    this.isLoadingSubject.next(true);
    let formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('identificacion', user.identificacion);
    formData.append('direccion', user.direccion);
    formData.append('estado', user.estado.toString());
    formData.append('usuario', user.usuario);
    formData.append('password', user.password ?? '12345678');
    formData.append('celular', user.celular.toString());
    formData.append('empresa_id', user.empresa_id.toString());
    formData.append('role_id', user.role_id.toString());
    formData.append('genero_id', user.genero_id.toString());
    formData.append('departamento_id', user.departamento_id.toString());
    formData.append('municipio_id', user.municipio_id.toString());
    formData.append('tipo_doc_id', user.tipo_doc_id.toString());
    // formData.append('fecha_nacimiento', user.fecha_nacimiento ? user.fecha_nacimiento.toISOString() : '');
    formData.append('fecha_nacimiento', user.fecha_nacimiento ? user.fecha_nacimiento : '');
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    // Agregar cada sede seleccionada al FormData
    sedes.forEach((sede_id) => {
      formData.append('sedes[]', sede_id.toString());
    });

    let URL = URL_SERVICIOS + `/configuracion/users/${user.id}`;

    return this.http.post<ResponseGestionUsers>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstadoUsuario(user: User, nuevoEstado: number): Observable<ResponseGestionUsers> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/users/${user.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionUsers>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listarUsuarios(page = 1, buscar: string = ''): Observable<ResponseUser> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/users?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseUser>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editarPerfil(user: User, file_name: File | null): Observable<ResponseGestionUsers> {

    this.isLoadingSubject.next(true);
    let formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('identificacion', user.identificacion);
    formData.append('direccion', user.direccion);
    formData.append('estado', user.estado.toString());
    formData.append('usuario', user.usuario);
    formData.append('password', user.password ?? '12345678');
    formData.append('celular', user.celular.toString());
    formData.append('empresa_id', user.empresa_id.toString());
    formData.append('role_id', user.role_id.toString());
    formData.append('genero_id', user.genero_id.toString());
    formData.append('departamento_id', user.departamento_id.toString());
    formData.append('municipio_id', user.municipio_id.toString());
    formData.append('tipo_doc_id', user.tipo_doc_id.toString());
    // formData.append('fecha_nacimiento', user.fecha_nacimiento ? user.fecha_nacimiento.toISOString() : '');
    formData.append('fecha_nacimiento', user.fecha_nacimiento ? user.fecha_nacimiento : '');
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    let URL = URL_SERVICIOS + `/configuracion/users/edit-perfil/${user.id}`;

    return this.http.post<ResponseGestionUsers>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEmail(user: User, email: string): Observable<ResponseGestionUsers> {

    this.isLoadingSubject.next(true);
    let formData = new FormData();

    formData.append('email', email);
    formData.append('empresa_id', user.empresa_id.toString());

    let URL = URL_SERVICIOS + `/configuracion/users/edit-email/${user.id}`;

    return this.http.post<ResponseGestionUsers>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  changePassword(user: User, data: { password: string; newpassword: string,empresa_id: number }): Observable<ResponseGestionUsers> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/users/edit-password/${user.id}`;

    return this.http.post<ResponseGestionUsers>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
