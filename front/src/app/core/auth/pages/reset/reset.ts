import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '@core/auth/api/auth-api';
import { ResetInfo } from '@core/auth/models/auth.model';
import { AlertStore } from '@shared/stores/alert-store';
import { AuthStore } from '@shared/stores/auth-store';
import { CacheStore } from '@shared/stores/cache-store';
import { LocalStore } from '@shared/stores/local-store';
import { ArrowLeft, Eye, EyeClosed, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'auth-reset',
  imports: [ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './reset.html',
  styles: ``,
})
export class Reset {
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertStore = inject(AlertStore);
  private readonly localStore = inject(LocalStore);
  private readonly cacheStore = inject(CacheStore);
  private readonly authStore = inject(AuthStore);
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly visible = Eye;
  readonly invisible = EyeClosed;
  readonly Back = ArrowLeft;

  resetForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    password: ['', [Validators.required, Validators.minLength(2)]],
    newPassword: ['', [Validators.required, Validators.minLength(2)]],
  });

  showPassword = false;
  waiting = false;

  constructor() {
    effect(() => {
      this.resetForm.get('email')?.setValue(this.localStore.getToConfirm() ?? '');
    });
  }

  checkField(field: string): boolean | undefined {
    return this.resetForm.get(field)?.invalid && this.resetForm.get(field)?.touched;
  }

  reset() {
    this.waiting = true;
    if (this.resetForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const reset: ResetInfo = this.resetForm.getRawValue();
    if (reset.password !== reset.newPassword) {
      this.alertStore.addAlert({
        message: 'Las contraseñas no coinciden',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    this.authApi.reset(reset).subscribe({
      next: (session) => {
        this.localStore.saveToConfirm();
        this.authStore.updateSession(session);
        this.alertStore.addAlert({
          message: 'Se ha restablecido la contraseña',
          type: 'success',
        });
        this.waiting = false;
        this.router.navigate([this.cacheStore.get('redirect') || '/']);
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
        this.waiting = false;
      },
    });
  }
}
