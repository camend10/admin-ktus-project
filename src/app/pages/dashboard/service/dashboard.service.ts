import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { ResponseFecha, Informacion, ResponseVentaSede, ResponseVentaDiaDelMes, ResponseVentaXMesDelYearA, ResponseVentaXSegmentoCliente, ResponseVendedorMasVenta, ResponseCategoriasMasVenta } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  config_all(): Observable<ResponseFecha> {
    this.isLoadingSubject.next(true);
    let data = {
      id: 1
    }
    let URL = URL_SERVICIOS + `/kpi/fecha-actual`;

    return this.http.post<ResponseFecha>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  informacion(data: { year: number, month: string }): Observable<Informacion> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/informacion-general`;

    return this.http.post<Informacion>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventasXSedes(data: { year: number, month: string }): Observable<ResponseVentaSede> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/venta-x-sede`;

    return this.http.post<ResponseVentaSede>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventasXDiaMes(data: { year: number, month: string, sede_id: number }): Observable<ResponseVentaDiaDelMes> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/venta-x-dia-del-mes`;

    return this.http.post<ResponseVentaDiaDelMes>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventasXMesDelYear(data: { year: number }): Observable<ResponseVentaXMesDelYearA> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/venta-x-mes-del-year`;

    return this.http.post<ResponseVentaXMesDelYearA>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventasXSegmentoCliente(data: { year: number, month: string, sede_id: number }): Observable<ResponseVentaXSegmentoCliente> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/venta-x-segmento`;

    return this.http.post<ResponseVentaXSegmentoCliente>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventasXVendedor(data: { year: number, month: string}): Observable<ResponseVendedorMasVenta> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/vendedor-mas-venta`;

    return this.http.post<ResponseVendedorMasVenta>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ventasXCategorias(data: { year: number, month: string}): Observable<ResponseCategoriasMasVenta> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kpi/categorias-mas-ventas`;

    return this.http.post<ResponseCategoriasMasVenta>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
