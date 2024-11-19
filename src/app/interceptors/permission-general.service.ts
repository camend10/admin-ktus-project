import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PermissionGeneralService {

  constructor(public router: Router,
    public toast: ToastrService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        switch (error.status) {
          case 0:
            Swal.fire({
              icon: 'error',
              title: 'Error de Conexión',
              text: 'No se pudo conectar con el servidor.',
            });
            break;
          case 401:
            Swal.fire({
              icon: 'warning',
              title: 'No Autenticado',
              text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            }).then(() => {
              this.router.navigate(['/auth/login']);
            });
            break;

          case 403:
            this.router.navigateByUrl('/');
            Swal.fire({
              icon: 'error',
              title: 'Acceso Denegado',
              text: 'No tienes permiso para realizar esta acción.',
            });
            break;
          case 404:
            Swal.fire({
              icon: 'error',
              title: 'No Encontrado',
              text: 'El recurso solicitado no está disponible.',
            });
            break;

          case 422:
            const mensajes = (Object.values(error.error.errors || {}) as string[][])
              .reduce((acc: string[], val: string[]) => acc.concat(val), []) // Aplanar manualmente
              .map((message, index) => `${index + 1}. ${message}`) // Añadir numeración
              .join('<br>'); // Combinar los mensajes con saltos de línea

            Swal.fire({
              icon: 'error',
              title: 'Errores de validación',
              html: mensajes,
            });
            break;

          case 429:
            Swal.fire({
              icon: 'warning',
              title: 'Demasiadas Solicitudes',
              text: 'Has enviado demasiadas solicitudes. Por favor, espera un momento antes de intentarlo nuevamente.',
            });
            break;

          case 500:
            Swal.fire({
              icon: 'error',
              title: 'Error Interno',
              html: 'Ocurrió un problema inesperado. <br> [' + error.error.message + ']',
            });
            break;
          case 504:
            Swal.fire({
              icon: 'error',
              title: 'Tiempo de Espera Excedido',
              text: 'El servidor tardó demasiado en responder. Intenta nuevamente más tarde.',
            });
            break;
          default:
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: 'Ocurrió un problema desconocido.',
            });
        }


        // if (response.status === 403 && response.error.message === 'This action is unauthorized.') {
        //   this.router.navigateByUrl('/');
        //   this.toast.error('NO PERMITIDO', 'No tiene permiso para ingresar a esta ruta');
        // }
        // Relanzar el error para que otros manejadores puedan procesarlo (si es necesario)
        return throwError(() => error);
      })
    );

  }
}
