import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { ResponseGestionSedeDeliverie, ResponseSedeDeliverie, SedeDeliverie } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SedeDeliverieService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(sedeDeliverie: SedeDeliverie): Observable<ResponseGestionSedeDeliverie> {

    this.isLoadingSubject.next(true);

    let data = {
      nombre: sedeDeliverie.nombre,
      direccion: sedeDeliverie.direccion,
      empresa_id: sedeDeliverie.empresa_id,
      sede_id: sedeDeliverie.sede_id,
      estado: 1
    };

    let URL = URL_SERVICIOS + "/configuracion/sede-deliveries";

    return this.http.post<ResponseGestionSedeDeliverie>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(sedeDeliverie: SedeDeliverie): Observable<ResponseGestionSedeDeliverie> {

    this.isLoadingSubject.next(true);

    let data = {
      id: sedeDeliverie.id,
      nombre: sedeDeliverie.nombre,
      direccion: sedeDeliverie.direccion,
      empresa_id: sedeDeliverie.empresa_id,
      sede_id: sedeDeliverie.sede_id,
      estado: sedeDeliverie.estado
    };

    let URL = URL_SERVICIOS + `/configuracion/sede-deliveries/${sedeDeliverie.id}`;

    return this.http.put<ResponseGestionSedeDeliverie>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(sedeDeliverie: SedeDeliverie, nuevoEstado: number): Observable<ResponseGestionSedeDeliverie> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/sede-deliveries/${sedeDeliverie.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionSedeDeliverie>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseSedeDeliverie> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/sede-deliveries?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseSedeDeliverie>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
