import { shopData } from '@/shop/shop.routes';
import { Routes } from '@angular/router';
import { authGuard } from '@shared/guard/auth-guard';

const modules: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('@core/auth/layouts/base/base').then((m) => m.Base),
  },
  {
    path: '',
    data: shopData,
    loadChildren: () => import('@/shop/shop.routes').then((m) => m.routes),
  },
  {
    path: 'client',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
];

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@core/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: '',
    children: modules,
    loadComponent: () => import('@shared/layout/base/base').then((m) => m.Base),
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
