import { CommerceApi } from '@/shop/api/commerce-api';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { AlertStore } from '@shared/stores/alert-store';
import { LucideAngularModule, Minus, Plus, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'shop-add-item',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './add-item.html',
  styles: ``,
})
export class AddItem {
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);

  readonly ShoppingCart = ShoppingCart;
  readonly Add = Plus;
  readonly Minus = Minus;

  id = input.required<number>();
  productType = input.required<'discographies' | 'promotions'>();
  stock = input<number>();
  btnClass = input<string>('');
  quantity = signal<number>(1);

  waiting = false;

  amount(stock?: number) {
    return typeof stock === 'number' && isFinite(stock) ? ` / ${stock}` : '';
  }

  addToCart() {
    this.waiting = true;
    this.commerceApi
      .createItem(this.id(), this.productType(), { quantity: this.quantity() })
      .subscribe({
        next: () => {
          this.alertStore.addAlert({
            message: 'Producto agregado al carrito',
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
}
