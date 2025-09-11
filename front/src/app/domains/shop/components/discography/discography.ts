import { CommerceApi } from '@/shop/api/commerce-api';
import { DiscographyInfo } from '@/shop/models/discography.model';
import { Order } from '@/shop/models/order.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertStore } from '@shared/stores/alert-store';
import { LucideAngularModule, ShoppingCart, Star } from 'lucide-angular';

@Component({
  selector: 'shop-discography',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './discography.html',
})
export class Discography {
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);

  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;

  discography = input.required<DiscographyInfo>();

  waiting = false;

  addToCart(discography: DiscographyInfo) {
    const addToCart = (orderId: number) => {
      this.commerceApi.createDiscographyItem(orderId, discography.id, { quantity: 1 }).subscribe({
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
    };
    this.waiting = true;
    this.commerceApi.getOrders().subscribe({
      next: (orders) => {
        const order = orders.find((order) => order.status === 'CART');
        if (order) {
          addToCart(order.id);
        } else {
          this.commerceApi.createOrder().subscribe({
            next: ({ id }) => {
              addToCart(id);
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

  discounted(discography: DiscographyInfo): number {
    if (discography.format !== 'CASSETTE') {
      return discography.price;
    }
    switch (discography.cassetteCondition) {
      case 'SEMI_USED':
        return discography.price * 0.8; // 20% discount
      case 'USED':
        return discography.price * 0.5; // 50% discount
      default:
        return discography.price;
    }
  }
}
