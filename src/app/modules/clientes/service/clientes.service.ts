import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, map } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { Cliente, ResponseCliente, ResponseGestionCliente, ResponseGestionSubir } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registrar(cliente: Cliente): Observable<ResponseGestionCliente> {

    this.isLoadingSubject.next(true);

    let data = {
      id: 0,
      tipo_identificacion: cliente.tipo_identificacion,
      identificacion: cliente.identificacion,
      dv: cliente.dv,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      email: cliente.email,
      direccion: cliente.direccion,
      celular: cliente.celular,
      departamento_id: cliente.departamento_id,
      municipio_id: cliente.municipio_id,
      empresa_id: cliente.empresa_id,
      estado: 1,
      is_parcial: cliente.is_parcial,
      segmento_cliente_id: cliente.segmento_cliente_id,
      ...(cliente.sede_id && { sede_id: cliente.sede_id }),
      ...(cliente.fecha_nacimiento && { fecha_nacimiento: cliente.fecha_nacimiento }),
      ...(cliente.genero_id && { genero_id: cliente.genero_id }),
      ...(this.authservice.user?.id && { user_id: this.authservice.user.id }),
    };

    let URL = URL_SERVICIOS + "/clientes";

    return this.http.post<ResponseGestionCliente>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editar(cliente: Cliente): Observable<ResponseGestionCliente> {

    this.isLoadingSubject.next(true);

    let data = {
      id: cliente.id,
      tipo_identificacion: cliente.tipo_identificacion,
      identificacion: cliente.identificacion,
      dv: cliente.dv,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      email: cliente.email,
      direccion: cliente.direccion,
      celular: cliente.celular,
      departamento_id: cliente.departamento_id,
      municipio_id: cliente.municipio_id,
      empresa_id: cliente.empresa_id,
      estado: 1,
      is_parcial: cliente.is_parcial,
      segmento_cliente_id: cliente.segmento_cliente_id,
      ...(cliente.sede_id && { sede_id: cliente.sede_id }),
      ...(cliente.fecha_nacimiento && { fecha_nacimiento: cliente.fecha_nacimiento }),
      ...(cliente.genero_id && { genero_id: cliente.genero_id }),
      ...(this.authservice.user?.id && { user_id: this.authservice.user.id }),
    };


    let URL = URL_SERVICIOS + `/clientes/${cliente.id}`;

    return this.http.put<ResponseGestionCliente>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cambiarEstado(cliente: Cliente, nuevoEstado: number): Observable<ResponseGestionCliente> {

    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/clientes/${cliente.id}/cambiar-estado`;

    return this.http.patch<ResponseGestionCliente>(URL, { estado: nuevoEstado }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listar(page = 1, data: { buscar: string; segmento_cliente_id: number; tipo: number }): Observable<ResponseCliente> {
    this.isLoadingSubject.next(true);

    const params = {
      buscar: data.buscar,
      segmento_cliente_id: data.segmento_cliente_id.toString(),
      tipo: data.tipo.toString()
    };


    let URL = URL_SERVICIOS + `/clientes/index?page=${page}`;

    return this.http.post<ResponseCliente>(URL, params).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  import_clientes(file_name: File): Observable<ResponseGestionSubir> {
    this.isLoadingSubject.next(true);

    let formData = new FormData();

    formData.append('import_file', file_name);

    let URL = URL_SERVICIOS + `/clientes/import/excel`;

    return this.http.post<ResponseGestionSubir>(URL,formData).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
