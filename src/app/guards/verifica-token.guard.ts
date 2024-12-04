import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../modules/auth';
import { inject } from '@angular/core';

export const verificaTokenGuard: CanActivateFn = (route, state) => {

  const _usuarioService = inject(AuthService);
  const router = inject(Router);

  const token = _usuarioService.token;

  // Verificar formato del token
  if (!token || typeof token !== 'string' || token.split('.').length < 3) {
    console.error('Token inválido o vacío:', token);
    router.navigate(['/auth/login']);
    return false;
  }

  let payload: any;

  try {
    // Decodificar el payload del token
    payload = JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    router.navigate(['/auth/login']);
    return false;
  }

  // Verificar si el token ha expirado
  const expirado = _usuarioService.expirado(payload.exp);
  if (expirado) {
    console.error('El token ha expirado');
    router.navigate(['/auth/login']);
    return false;
  }

  // Verificar y renovar el token si es necesario
  return _usuarioService.verificaRenueva(payload.exp);
};
