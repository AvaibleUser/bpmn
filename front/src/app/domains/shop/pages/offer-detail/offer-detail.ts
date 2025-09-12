import { CommerceApi } from '@/shop/api/commerce-api';
import { ProductsApi } from '@/shop/api/products-api';
import { AddItem } from '@/shop/components/add-item/add-item';
import { Discography } from '@/shop/components/discography/discography';
import { DiscographyInfo } from '@/shop/models/discography.model';
import { PromotionInfo } from '@/shop/models/promotion.model';
import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@core/auth/models/auth.model';
import { Page } from '@shared/models/pageable.model';
import { AlertStore } from '@shared/stores/alert-store';
import { AuthStore } from '@shared/stores/auth-store';
import {
  BadgePercent,
  Calendar1,
  CalendarOff,
  LucideAngularModule,
  Pencil,
  Trash2,
} from 'lucide-angular';

@Component({
  selector: 'shop-offer-detail',
  imports: [CommonModule, LucideAngularModule, AddItem, Discography],
  templateUrl: './offer-detail.html',
  styles: ``,
})
export class OfferDetail {
  private readonly authStore = inject(AuthStore);
  private readonly productsApi = inject(ProductsApi);
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);
  private readonly router = inject(Router);

  readonly Discount = BadgePercent;
  readonly StartDate = Calendar1;
  readonly EndDate = CalendarOff;
  readonly Delete = Trash2;
  readonly Edit = Pencil;

  readonly id = input.required<number>({ alias: 'promotionId' });

  promotion?: PromotionInfo;
  userRole?: Role;
  waiting = false;
  discographies?: Page<DiscographyInfo>;

  constructor() {
    effect(() => {
      this.userRole = this.authStore.session().token ? this.authStore.session().role : undefined;
      this.commerceApi.getPromotion(this.id()).subscribe({
        next: (promotion) => {
          this.promotion = promotion;
          this.productsApi.getDiscographies({ page: 0, size: 1000 }).subscribe((discographies) => {
            discographies.content = discographies.content.filter((cd) =>
              this.promotion?.cds.map((cd) => cd.id).includes(cd.id)
            );
            this.discographies = discographies;
          });
        },
        error: () => {
          this.router.navigate(['/promotions']);
        },
      });
    });
  }

  delete() {
    this.alertStore.addAlert({
      message: 'Estas seguro de eliminar la promoción?',
      type: 'error',
      accept: () => {
        this.commerceApi.deletePromotion(this.id()).subscribe({
          next: () => {
            this.alertStore.addAlert({
              message: 'Promoción eliminado',
              type: 'success',
            });
            this.router.navigate(['/promotions']);
          },
          error: (error: HttpErrorResponse) => {
            this.alertStore.addAlert({
              message: error.error.message,
              type: 'error',
            });
          },
        });
      },
    });
  }

  price(promotion: PromotionInfo): number {
    return promotion.cds.reduce((acc, b) => acc + b.price, 0);
  }

  discounted(promotion: PromotionInfo): number {
    return (1 - promotion.groupTypeDiscount) * this.price(promotion);
  }

  stock(promotion: PromotionInfo): number {
    return Math.min(...promotion.cds.map((cd) => cd.stock).filter((stock) => stock !== null));
  }

  details(promotion: PromotionInfo) {
    return [
      {
        icon: this.EndDate,
        label: 'Tipo de agrupamiento',
        condition: !!promotion.endDate,
      },
      {
        icon: this.StartDate,
        label: 'Fecha de lanzamiento',
        value: formatDate(promotion.startDate, 'dd/MM/yyyy', 'en-US'),
      },
      {
        icon: this.EndDate,
        label: 'Fecha de finalización',
        value: !promotion.endDate || formatDate(promotion.endDate, 'dd/MM/yyyy', 'en-US'),
        condition: !!promotion.endDate,
      },
    ];
  }
}
