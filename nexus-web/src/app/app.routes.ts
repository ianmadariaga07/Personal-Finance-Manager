import { Routes } from '@angular/router';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    //lazy loading para la vista del login
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'transactions',
    //proteccion de la ruta y lazy loading de transacciones
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/transaction-list/transaction-list').then(
        (m) => m.TransactionList,
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    //rutas inexistentes
    path: '**',
    redirectTo: 'login',
  },
];
