import { Routes } from '@angular/router';

const innerRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'confirmation',
    loadComponent: () => import('./pages/confirmation/confirmation').then((m) => m.Confirmation),
  },
  {
    path: '2fa',
    loadComponent: () => import('./pages/mfa/mfa').then((m) => m.Mfa),
  },
  {
    path: 'recover',
    loadComponent: () => import('./pages/recover/recover').then((m) => m.Recover),
  },
  {
    path: 'reset',
    loadComponent: () => import('./pages/reset/reset').then((m) => m.Reset),
  },
];

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'prefix',
  },
  {
    path: '',
    loadComponent: () => import('./layouts/base/base').then((m) => m.Base),
    children: innerRoutes,
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
