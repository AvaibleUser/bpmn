import { adminData } from '@/admin/admin.routes';
import { shopData } from '@/shop/shop.routes';
import { Routes } from '@angular/router';
import { authGuard } from '@shared/guard/auth-guard';

const sidebarItems = [...shopData.sidebarItems, ...adminData.sidebarItems];

const modules: Routes = [
  {
    path: 'admin',
    data: { ...shopData, sidebarItems },
    canActivate: [authGuard],
    loadChildren: () => import('@/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '',
    data: { ...shopData, sidebarItems },
    loadChildren: () => import('@/shop/shop.routes').then((m) => m.routes),
  },
  {
    path: 'client',
    redirectTo: '',
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
