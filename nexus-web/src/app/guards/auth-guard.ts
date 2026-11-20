import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  //leer la sesion desde el signal
  const hasSession = authService.isLoggedIn();

  if (hasSession) {
    return true;
  }

  //Si no esta logueado o la sesion no esta activa, lo mandamos al login
  return router.createUrlTree(['/login']);
};
