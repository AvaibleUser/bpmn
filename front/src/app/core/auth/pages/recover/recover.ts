import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '@core/auth/api/auth-api';
import { AlertStore } from '@shared/stores/alert-store';
import { LocalStore } from '@shared/stores/local-store';

@Component({
  selector: 'auth-recover',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './recover.html',
  styles: ``,
})
export class Recover {
  private readonly formBuilder = inject(FormBuilder);
  private readonly alertStore = inject(AlertStore);
  private readonly localStore = inject(LocalStore);
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  email = this.formBuilder.control('', [Validators.required, Validators.email]);

  waiting = false;

  recover() {
    this.waiting = true;
    if (this.email.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const email = this.email.value!;
    this.authApi.recover(email).subscribe({
      next: () => {
        this.localStore.saveToConfirm(email);
        this.alertStore.addAlert({
          message: 'Se ha enviado un correo de restablecimiento de contraseña',
          type: 'success',
        });
        this.waiting = false;
        this.router.navigate(['/auth/reset']);
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
