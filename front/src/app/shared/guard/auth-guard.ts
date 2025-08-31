import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@shared/stores/auth-store';

export const authGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const session = authStore.session();

  if (!session.token) {
    authStore.logout();
    router.navigate(['/auth']);
    return true;
  }
  if (route.data['role'] && session.role !== route.data['role']) {
    router.navigate([!session.role ? '/auth' : `/${session.role}`]);
  }
  return true;
};
