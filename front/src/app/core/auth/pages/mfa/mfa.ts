import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '@core/auth/api/auth-api';
import { CheckCode } from '@core/auth/models/auth.model';
import { AlertStore } from '@shared/stores/alert-store';
import { AuthStore } from '@shared/stores/auth-store';
import { CacheStore } from '@shared/stores/cache-store';
import { LocalStore } from '@shared/stores/local-store';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'auth-mfa',
  imports: [ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './mfa.html',
})
export class Mfa implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertStore = inject(AlertStore);
  private readonly localStore = inject(LocalStore);
  private readonly cacheStore = inject(CacheStore);
  private readonly authStore = inject(AuthStore);
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  readonly Back = ArrowLeft;

  confirmForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  waiting = signal(false);

  ngOnInit(): void {
    this.confirmForm.get('email')?.setValue(this.localStore.getToConfirm() ?? '');
  }

  checkField(field: string): boolean | undefined {
    return this.confirmForm.get(field)?.touched && this.confirmForm.get(field)?.invalid;
  }

  confirm() {
    this.waiting.set(true);
    if (this.confirmForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }

    const confirmation: CheckCode = this.confirmForm.getRawValue();
    this.authApi.mfa(confirmation).subscribe({
      next: (session) => {
        this.localStore.saveToConfirm();
        this.authStore.updateSession(session);
        this.alertStore.addAlert({
          message: 'Verificación en 2 pasos exitosa',
          type: 'success',
        });
        this.waiting.set(false);
        this.router.navigate([this.cacheStore.cache()?.['redirect'] || `/${session.role.toLocaleLowerCase()}`]);
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
