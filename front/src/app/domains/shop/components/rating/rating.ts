import { InteractionApi } from '@/shop/api/interaction-api';
import { RatingCreate, RatingStats } from '@/shop/models/rating.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertStore } from '@shared/stores/alert-store';
import { CacheStore } from '@shared/stores/cache-store';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'shop-rating',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './rating.html',
  styles: ``,
})
export class Rating {
  private readonly formBuilder = inject(FormBuilder);
  private readonly interactionApi = inject(InteractionApi);
  private readonly alertStore = inject(AlertStore);
  private readonly cacheStore = inject(CacheStore);
  private readonly router = inject(Router);

  readonly Star = Star;

  readonly productId = input.required<number>();
  readonly authenticated = input.required<boolean>();

  waiting = false;
  rating?: RatingStats;

  ratingForm: FormGroup = this.formBuilder.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  constructor() {
    effect(() => {
      this.loadRating();
    });
  }

  checkField(field: string): boolean | undefined {
    return this.ratingForm.get(field)?.touched && this.ratingForm.get(field)?.invalid;
  }

  rate() {
    if (!this.authenticated()) {
      this.cacheStore.set('redirect', this.router.url);
      this.router.navigate(['auth', 'login']);
      return;
    }
    this.waiting = true;
    if (this.ratingForm.invalid) {
      this.alertStore.addAlert({
        message: 'Revisa los campos inválidos',
        type: 'error',
      });
      this.waiting = false;
      return;
    }

    const rating: RatingCreate = this.ratingForm.getRawValue();
    const rate = !this.rating?.userRating
      ? this.interactionApi.createRating(this.productId(), rating)
      : this.interactionApi.updateRating(this.productId(), rating);
    this.rating = undefined;
    rate.subscribe({
      next: () => {
        this.loadRating();
        this.waiting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.ratingForm.reset();
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
        this.waiting = false;
      },
    });
  }

  private loadRating() {
    this.interactionApi.getRatingStats(this.productId()).subscribe({
      next: (rating) => {
        this.rating = rating;
        this.ratingForm.patchValue({ rating: rating.userRating || 0 });
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error.message,
          type: 'error',
        });
      },
    });
  }
}
