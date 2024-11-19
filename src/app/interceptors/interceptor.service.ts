import { Injectable } from '@angular/core';
import { AuthService } from '../modules/auth';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  token: string = '';
  authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.endsWith('/auth/login')) {
      // Si es una solicitud de inicio de sesión, no agregamos el encabezado de autorización
      return next.handle(req);
    }

    const token = this.authService.token;
    // Verifica si el token existe
    if (token) {
      const headers = new HttpHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const reqClone = req.clone({
        headers,
      });

      return next.handle(reqClone).pipe(catchError((error) => this.manejarError(error)));
    }

    // Si no hay token, envía la solicitud original
    return next.handle(req).pipe(catchError((error) => this.manejarError(error)));
  }

  manejarError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
