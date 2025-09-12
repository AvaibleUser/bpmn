import { CommerceApi } from '@/shop/api/commerce-api';
import { Discography } from '@/shop/components/discography/discography';
import { Promotion } from '@/shop/components/promotion/promotion';
import { Item } from '@/shop/models/item.model';
import { Order } from '@/shop/models/order.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertStore } from '@shared/stores/alert-store';
import { CreditCard, LucideAngularModule, ShoppingBag, ShoppingCart, Trash2 } from 'lucide-angular';

@Component({
  selector: 'commerce-cart',
  imports: [CommonModule, RouterModule, LucideAngularModule, Discography, Promotion],
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);
  private readonly router = inject(Router);

  readonly ShoppingCart = ShoppingCart;
  readonly ShoppingBag = ShoppingBag;
  readonly CreditCard = CreditCard;
  readonly Delete = Trash2;

  cart?: Order;
  items?: Item[];
  loading = false;
  waiting = false;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.commerceApi.getOrders('CART').subscribe({
      next: (orders) => {
        if (orders.length > 0) {
          this.cart = orders.find((o) => o.status === 'CART');
          if (!this.cart) {
            this.loading = false;
            return;
          }
          this.commerceApi.getItems(this.cart.id).subscribe({
            next: (items) => {
              this.items = items;
              this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
              this.alertStore.addAlert({
                message: error.error?.message || 'Error al cargar los items del carrito',
                type: 'error',
              });
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error?.message || 'Error al cargar el carrito',
          type: 'error',
        });
        this.loading = false;
      },
    });
  }

  get totalItems() {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items?.reduce((sum, item) => sum + item.subtotal, 0);
  }

  removeItem(itemId: number) {
    const item = this.items!.find((item) => item.id === itemId)!;
    const itemName = item.discography?.title || item.promotion?.name;

    this.alertStore.addAlert({
      message: `¿Estás seguro de eliminar "${itemName}" del carrito?`,
      type: 'error',
      accept: () => {
        this.commerceApi.deleteItem(this.cart!.id, itemId).subscribe({
          next: () => {
            this.items = this.items?.filter((item) => item.id !== itemId);
            this.alertStore.addAlert({
              message: 'Producto eliminado del carrito',
              type: 'success',
            });
          },
          error: (error: HttpErrorResponse) => {
            this.alertStore.addAlert({
              message: error.error?.message || 'Error al eliminar el producto',
              type: 'error',
            });
          },
        });
      },
    });
  }

  clearCart() {
    this.alertStore.addAlert({
      message: '¿Estás seguro de vaciar todo el carrito?',
      type: 'error',
      accept: () => {
        this.commerceApi.deleteOrder(this.cart!.id).subscribe({
          next: () => {
            this.alertStore.addAlert({
              message: 'Carrito vaciado exitosamente',
              type: 'success',
            });
            this.router.navigate(['/products']);
          },
          error: (error: HttpErrorResponse) => {
            this.alertStore.addAlert({
              message: error.error?.message || 'Error al vaciar el carrito',
              type: 'error',
            });
          },
        });
      },
    });
  }

  processPayment() {
    this.waiting = true;
    this.commerceApi.payOrder(this.cart!.id).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: '¡Pago procesado exitosamente! Tu pedido ha sido completado.',
          type: 'success',
        });
        this.waiting = false;
        this.router.navigate(['/products']);
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error?.message || 'Error al procesar el pago',
          type: 'error',
        });
        this.waiting = false;
      },
    });
  }
}
