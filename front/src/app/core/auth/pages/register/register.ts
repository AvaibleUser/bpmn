import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '@core/auth/api/auth-api';
import { SignupInfo } from '@core/auth/models/auth.model';
import { AlertStore } from '@shared/stores/alert-store';
import { LocalStore } from '@shared/stores/local-store';
import { Eye, EyeClosed, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'auth-register',
  imports: [ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertStore = inject(AlertStore);
  private readonly localStore = inject(LocalStore);
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly visible = Eye;
  readonly invisible = EyeClosed;

  registerForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
    confirm: ['', [Validators.required, Validators.minLength(2)]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
  });

  showPassword = signal(false);
  waiting = signal(false);

  checkField(field: string): boolean | undefined {
    return this.registerForm.get(field)?.touched && this.registerForm.get(field)?.invalid;
  }

  register() {
    this.waiting.set(true);
    if (this.registerForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }

    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirm')?.value) {
      this.alertStore.addAlert({
        message: 'Las contraseñas no coinciden',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }

    const register: SignupInfo = this.registerForm.getRawValue();
    this.authApi.register(register).subscribe({
      next: () => {
        this.localStore.saveToConfirm(register.email);
        this.alertStore.addAlert({
          message: 'Se ha registrado correctamente',
          type: 'success',
        });
        this.waiting.set(false);
        this.router.navigate(['/auth/confirmation']);
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
