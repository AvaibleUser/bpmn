import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, Roles, Session } from '@core/auth/models/auth.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LocalStore } from '@shared/stores/local-store';

export const initialState: Auth = {
  session: {
    token: '',
    id: 0,
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    role: Roles.CLIENT,
  },
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState((localStore = inject(LocalStore)) => localStore.getSession()),
  withMethods((store, router = inject(Router), localStore = inject(LocalStore)) => ({
    updateSession(session: Session) {
      patchState(store, { session });
      localStore.saveSession({ session });
    },

    logout() {
      patchState(store, initialState);
      localStore.saveSession(initialState);
      router.navigate(['/auth']);
    },
  }))
);
