import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CheckCode, LoginInfo, SignupInfo, Session } from '@core/auth/models/auth.model';
import { environment } from '@environment/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly api = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);

  login(login: LoginInfo): Observable<void> {
    return this.http.post<void>(`${this.api}/sign-in`, login);
  }

  mfa(confirm: CheckCode): Observable<Session> {
    return this.http.put<Session>(`${this.api}/sign-in/2fa`, confirm);
  }

  register(register: SignupInfo): Observable<void> {
    return this.http.post<void>(`${this.api}/sign-up`, register);
  }

  confirmation(confirmation: CheckCode): Observable<Session> {
    return this.http.put<Session>(`${this.api}/sign-up`, confirmation);
  }
}
