import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Router } from '@angular/router';
import { Categoria, ResponseCategoria, ResponseGestionCategoria } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(categoria: Categoria, file_name: File | null): Observable<ResponseGestionCategoria> {

    this.isLoadingSubject.next(true);

    let formData = new FormData();
    formData.append('nombre', categoria.nombre);
    formData.append('descripcion', categoria.descripcion);
    formData.append('empresa_id', categoria.empresa_id.toString());
    formData.append('estado', String(1));
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    let URL = URL_SERVICIOS + "/configuracion/categorias";

    return this.http.post<ResponseGestionCategoria>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(categoria: Categoria, file_name: File | null): Observable<ResponseGestionCategoria> {

    this.isLoadingSubject.next(true);
    let formData = new FormData();
    formData.append('nombre', categoria.nombre);
    formData.append('descripcion', categoria.descripcion);
    formData.append('empresa_id', categoria.empresa_id.toString());
    formData.append('estado', categoria.estado.toString());
    if (file_name) {
      formData.append('imagen', file_name);
    } else {
      formData.append('imagen', ''); // O envía 'null' si el backend lo acepta
    }

    let URL = URL_SERVICIOS + `/configuracion/categorias/${categoria.id}`;

    return this.http.post<ResponseGestionCategoria>(URL, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(categoria: Categoria, nuevoEstado: number): Observable<ResponseGestionCategoria> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/categorias/${categoria.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionCategoria>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, buscar: string = ''): Observable<ResponseCategoria> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/configuracion/categorias?page=${page}&buscar=${buscar}`;

    return this.http.get<ResponseCategoria>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
