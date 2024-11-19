import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Role } from '../models/role.model';
import { ResponseGestionRoles, ResponseRoles, Roles } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrarRole(role: Role): Observable<ResponseGestionRoles> {

    this.isLoadingSubject.next(true);

    let data = {
      name: role.name,
      permissions: role.permissions
    };
    let URL = URL_SERVICIOS + "/configuracion/roles";

    return this.http.post<ResponseGestionRoles>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editarRole(role: Role): Observable<ResponseGestionRoles> {

    this.isLoadingSubject.next(true);

    let data = {
      id: role.id,
      name: role.name,
      permissions: role.permissions
    };
    let URL = URL_SERVICIOS + `/configuracion/roles/${role.id}`;

    return this.http.put<ResponseGestionRoles>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  eliminarRole(role: Role): Observable<ResponseGestionRoles> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/roles/${role.id}`;

    return this.http.delete<ResponseGestionRoles>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listarRoles(page = 1, buscar: string = ''): Observable<ResponseRoles> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/roles?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseRoles>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // SI QUISIERA RETORNAR SOLO ROLES

  // listarRoles(page = 1, buscar: string = ''): Observable<Roles[]> {
  //   this.isLoadingSubject.next(true);

  //   let URL = URL_SERVICIOS + `/roles?page=${page}&buscar=${buscar}`;

  //   return this.http.get<ResponseRoles>(URL).pipe(
  //     finalize(() => this.isLoadingSubject.next(false)),
  //     map(resp=> resp.roles)
  //   );
  // }
}
