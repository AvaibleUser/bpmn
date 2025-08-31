import { Routes } from '@angular/router';
import { ShoppingCart } from 'lucide-angular';

const modules: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
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
  sidebarItems: [{ name: 'Tienda', icon: ShoppingCart, path: '/products' }],
};
