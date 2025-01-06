import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../auth';
import { ResponseKardex } from '../interfaces';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listar(data: {
    year: number;
    month: string;
    articulo: string;
    bodega_id: number;
  }): Observable<ResponseKardex> {
    this.isLoadingSubject.next(true);

    let URL = URL_SERVICIOS + `/kardex/index`;

    return this.http.post<ResponseKardex>(URL, data).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
