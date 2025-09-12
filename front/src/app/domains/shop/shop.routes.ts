import { Routes } from '@angular/router';
import { authGuard } from '@shared/guard/auth-guard';
import { Boxes, HeartHandshake, Music, ShoppingCart } from 'lucide-angular';

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
  {
    path: 'promotions/:promotionId',
    loadComponent: () => import('./pages/offer-detail/offer-detail').then((m) => m.OfferDetail),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/wishlist/wishlist').then((m) => m.Wishlist),
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
    { name: 'Carrito', icon: ShoppingCart, path: '/cart', roles: ['CLIENT', 'ADMIN'] },
    {
      name: 'Lista de deseos',
      icon: HeartHandshake,
      path: '/wishlist',
      roles: ['CLIENT', 'ADMIN'],
    },
  ],
};
