import { Injectable } from '@angular/core';
import { Auth } from '@core/auth/models/auth.model';
import { initialState } from '@shared/stores/auth-store';

@Injectable({
  providedIn: 'root',
})
export class LocalStore {
  private readonly sessionKey: string = 'session';
  private readonly toConfirmKey: string = 'check';

  saveSession(session: Auth) {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  getSession(): Auth {
    const session = localStorage.getItem(this.sessionKey);
    return session ? JSON.parse(session) : initialState;
  }

  saveToConfirm(email: string | undefined = undefined) {
    if (email) {
      localStorage.setItem(this.toConfirmKey, email);
    } else {
      localStorage.removeItem(this.toConfirmKey);
    }
  }

  getToConfirm(): string | null {
    return localStorage.getItem(this.toConfirmKey);
  }
}
