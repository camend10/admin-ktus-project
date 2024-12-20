import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { Cliente, ResponseCliente, ResponseGestionCliente } from '../../clientes/interfaces';
import { ResponseArticulo } from '../../articulos/interfaces';
import { Factura, ResponseFactura, ResponseGestionDetalle, ResponseGestionFactura } from '../interfaces';

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

  create(data: FormData): Observable<ResponseGestionFactura> {

    this.isLoadingSubject.next(true);
    
    let URL = URL_SERVICIOS + "/facturas";

    return this.http.post<ResponseGestionFactura>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1,
    data: {
      buscar: string;
      segmento_cliente_id: number;
      categoria_id: number,
      vendedor_id: number,
      cliente: string,
      articulo: string,
      fecha_inicio: string,
      fecha_final: string,
    }
  ): Observable<ResponseFactura> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/facturas/index?page=${page}`;

    return this.http.post<ResponseFactura>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showFactura(id: number): Observable<ResponseGestionFactura> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/facturas/${id}`;

    return this.http.get<ResponseGestionFactura>(URL).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteItemDetalle(id: number): Observable<ResponseGestionDetalle> {
    this.isLoadingSubject.next(true);
    let data = {
      id: id
    }
    let URL = URL_SERVICIOS + `/facturas/eliminar-detalle`;

    return this.http.post<ResponseGestionDetalle>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  edit(data: FormData, id: number): Observable<ResponseGestionFactura> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/facturas/editar/${id}`;

    return this.http.post<ResponseGestionFactura>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(factura: Factura, nuevoEstado: number): Observable<ResponseGestionFactura> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/facturas/${factura.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionFactura>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
