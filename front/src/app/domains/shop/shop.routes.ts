import { Routes } from '@angular/router';
import { Music } from 'lucide-angular';

const modules: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
  },
  {
    path: 'products/:productId',
    loadComponent: () => import('./pages/detail/detail').then((m) => m.Detail),
  },
];

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'prefix',
  },
  {
    path: '',
    children: modules,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

export const shopData = {
  baseUrl: '/',
  sidebarItems: [{ name: 'Productos', icon: Music, path: '/products' }],
};
