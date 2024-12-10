import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { Cliente, ResponseCliente, ResponseGestionCliente } from '../../clientes/interfaces';
import { ResponseArticulo } from '../../articulos/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  buscarCliente(cliente: Cliente): Observable<ResponseCliente> {
    this.isLoadingSubject.next(true);

    const params = {
      identificacion: cliente.identificacion,
      nombres: cliente.nombres,
      celular: cliente.celular,
      empresa_id: this.authservice.user.empresa_id
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    let URL = URL_SERVICIOS + "/clientes/buscar-clientes" + link;

    return this.http.get<ResponseCliente>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  buscarArticulos(buscar_articulo: String): Observable<ResponseArticulo> {
    this.isLoadingSubject.next(true);

    const params = {
      buscar: buscar_articulo,
      empresa_id: this.authservice.user.empresa_id
    };

    // Filtrar las claves excepto 'buscar', que siempre se envía

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Construir el enlace
    const link = queryString ? `?${queryString}` : '';

    let URL = URL_SERVICIOS + "/articulos/buscar-articulos" + link;
    
    return this.http.get<ResponseArticulo>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
