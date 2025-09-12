import { Routes } from '@angular/router';
import { Boxes, Music } from 'lucide-angular';

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
  {
    path: 'promotions',
    loadComponent: () => import('./pages/promotions/promotions').then((m) => m.Promotions),
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
  sidebarItems: [
    { name: 'Productos', icon: Music, path: '/products' },
    { name: 'Promociones', icon: Boxes, path: '/promotions' },
  ],
};
