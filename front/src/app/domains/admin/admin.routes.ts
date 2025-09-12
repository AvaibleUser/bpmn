import { Routes } from '@angular/router';
import { ClipboardList } from 'lucide-angular';

const modules: Routes = [
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory').then((m) => m.Inventory),
  },
];

export const adminRoutes: Routes = [
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

export const adminData = {
  sidebarItems: [{ name: 'Inventario', icon: ClipboardList, path: '/inventory', roles: ['ADMIN'] }],
};
