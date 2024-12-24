import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Plantilla, ResponseGestionPlantilla, ResponsePlantilla } from '../interfaces';



@Injectable({
  providedIn: 'root'
})
export class PlantillasService {


  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  create(plantilla: Plantilla): Observable<ResponseGestionPlantilla> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + "/plantillas";

    return this.http.post<ResponseGestionPlantilla>(URL, plantilla).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponsePlantilla> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/plantillas?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponsePlantilla>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showMovimiento(id: number): Observable<ResponseGestionPlantilla> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/plantillas/${id}`;

    return this.http.get<ResponseGestionPlantilla>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  edit(plantilla: Plantilla, id: number): Observable<ResponseGestionPlantilla> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/plantillas/${id}`;

    return this.http.put<ResponseGestionPlantilla>(URL, plantilla).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(plantilla: Plantilla, nuevoEstado: number): Observable<ResponseGestionPlantilla> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/plantillas/${plantilla.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionPlantilla>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
