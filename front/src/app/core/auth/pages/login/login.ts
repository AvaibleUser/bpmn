import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '@core/auth/api/auth-api';
import { LoginInfo } from '@core/auth/models/auth.model';
import { AlertStore } from '@shared/stores/alert-store';
import { LocalStore } from '@shared/stores/local-store';
import { Eye, EyeClosed, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'auth-login',
  imports: [ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertStore = inject(AlertStore);
  private readonly localStore = inject(LocalStore);
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly visible = Eye;
  readonly invisible = EyeClosed;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });

  showPassword = signal(false);
  waiting = signal(false);

  checkField(field: string): boolean | undefined {
    return this.loginForm.get(field)?.touched && this.loginForm.get(field)?.invalid;
  }

  login() {
    this.waiting.set(true);
    if (this.loginForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }

    const login: LoginInfo = this.loginForm.getRawValue();
    this.authApi.login(login).subscribe({
      next: () => {
        this.localStore.saveToConfirm(login.email);
        this.alertStore.addAlert({
          message: 'Inicio de sesión exitoso',
          type: 'success',
        });
        this.waiting.set(false);
        this.router.navigate(['/auth/2fa']);
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
        this.waiting.set(false);
      },
    });
  }
}
