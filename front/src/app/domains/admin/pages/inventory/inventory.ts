import { AddPurchase, Purchase } from '@/admin/models/purchase.model';
import { CommerceApi } from '@/shop/api/commerce-api';
import { ProductsApi } from '@/shop/api/products-api';
import { DiscographyInfo } from '@/shop/models/discography.model';
import { Order, Status } from '@/shop/models/order.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertStore } from '@shared/stores/alert-store';
import { Eye, LucideAngularModule, PackageCheck, Plus } from 'lucide-angular';

@Component({
  selector: 'admin-inventory',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './inventory.html',
  styles: ``,
})
export class Inventory {
  private readonly formBuilder = inject(FormBuilder);
  private readonly commerceApi = inject(CommerceApi);
  private readonly productsApi = inject(ProductsApi);
  private readonly alertStore = inject(AlertStore);

  readonly Add = Plus;
  readonly Details = Eye;
  readonly Send = PackageCheck;

  readonly tab = signal<0 | 1 | 2>(0);

  discographies?: DiscographyInfo[];
  purchases?: Purchase[];
  orders?: Order[];
  status = this.formBuilder.control('' as Status);
  title = this.formBuilder.control('');
  waiting = signal(true);
  discographyId = this.formBuilder.control(0, [Validators.required, Validators.min(1)]);
  purchase: FormGroup = this.formBuilder.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      if (this.waiting()) {
      }
      switch (this.tab()) {
        case 0:
          this.commerceApi.getPurchases().subscribe({
            next: (purchases) => {
              this.purchases = purchases;
              this.waiting.set(false);
            },
            error: () => {
              this.purchases = [];
              this.waiting.set(false);
            },
          });
          break;
        case 1:
          this.commerceApi.getOrders(this.status.value || undefined).subscribe({
            next: (orders) => {
              if (!this.status.value) {
                orders = orders.filter((o) => o.status !== 'CART');
              }
              this.orders = orders;
              this.waiting.set(false);
            },
            error: () => {
              this.orders = [];
              this.waiting.set(false);
            },
          });
          break;
        case 2:
          this.productsApi
            .getDiscographies({ title: this.title.value || undefined, page: 0, size: 100 })
            .subscribe({
              next: (discographies) => {
                this.discographies = discographies.content;
                this.waiting.set(false);
              },
              error: () => {
                this.discographies = [];
                this.waiting.set(false);
              },
            });
          break;
      }
    });
  }

  changeDiscography(id: number) {
    this.discographyId.setValue(id);
  }

  changeStatus() {
    this.waiting.set(true);
  }

  sendOrder(orderId: number) {
    this.waiting.set(true);
    this.commerceApi.sendOrder(orderId).subscribe({
      next: () => {
        this.waiting.set(false);
      },
      error: () => {
        this.waiting.set(false);
      },
    });
  }

  addPurchase() {
    this.waiting.set(true);
    if (this.discographyId.invalid) {
      this.alertStore.addAlert({
        message: 'Se debe seleccionar una discografía',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }
    if (this.purchase.invalid || !this.purchase.value.unitPrice) {
      this.alertStore.addAlert({
        message: 'Se debe ingresar una cantidad y un precio válido',
        type: 'error',
      });
      this.waiting.set(false);
      return;
    }

    const discographyId = this.discographyId.getRawValue()!;
    const purchase: AddPurchase = this.purchase.getRawValue();
    this.commerceApi.createPurchase(discographyId, purchase).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Se agregaron los artículos para la venta',
          type: 'success',
        });
        this.waiting.set(false);
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
