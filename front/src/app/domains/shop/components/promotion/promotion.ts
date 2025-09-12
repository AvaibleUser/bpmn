import { CommerceApi } from '@/shop/api/commerce-api';
import { Promotion as PromotionInfo } from '@/shop/models/promotion.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertStore } from '@shared/stores/alert-store';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'shop-promotion',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './promotion.html',
  styles: ``,
})
export class Promotion {
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);

  readonly ShoppingCart = ShoppingCart;

  promotion = input.required<PromotionInfo>();

  waiting = false;

  addToCart(promotion: PromotionInfo) {
    this.waiting = true;
    this.commerceApi.createPromotionItem(promotion.id, { quantity: 1 }).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Promoción agregado al carrito',
          type: 'success',
        });
        this.waiting = false;
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

  discounted(promotion: PromotionInfo): number {
    return (1 - promotion.groupTypeDiscount) * promotion.cds.reduce((acc, b) => acc + b.price, 0);
  }
}
