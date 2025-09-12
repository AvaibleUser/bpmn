import { CommerceApi } from '@/shop/api/commerce-api';
import { Promotion } from '@/shop/components/promotion/promotion';
import { PromotionInfo } from '@/shop/models/promotion.model';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Role } from '@core/auth/models/auth.model';
import { Page, Pageable, WithPage } from '@shared/models/pageable.model';
import { AuthStore } from '@shared/stores/auth-store';
import { ModalStore } from '@shared/stores/modal-store';
import { ChevronLeft, ChevronRight, LucideAngularModule, PackagePlus } from 'lucide-angular';

@Component({
  selector: 'shop-promotions',
  imports: [CommonModule, LucideAngularModule, Promotion],
  templateUrl: './promotions.html',
  styles: ``,
})
export class Promotions extends WithPage<PromotionInfo> {
  private readonly commerceApi = inject(CommerceApi);
  private readonly authStore = inject(AuthStore);
  private readonly modalStore = inject(ModalStore);

  readonly Previous = ChevronLeft;
  readonly Next = ChevronRight;
  readonly Plus = PackagePlus;

  readonly page = signal<number>(0);

  userRole?: Role;
  waiting = false;
  promotions?: Page<PromotionInfo>;

  constructor() {
    super();
    effect(() => {
      this.userRole = this.authStore.session().token ? this.authStore.session().role : undefined;
      this.loadPromotions({ page: this.page() });
    });
  }

  loadPromotions(filters: Pageable<{}> = {}) {
    this.commerceApi.getPromotions({ ...filters, size: 9 }).subscribe((promotions) => {
      this.promotions = promotions;
      this.page.set(promotions.page.number);
      this.waiting = false;
    });
  }

  addPromotion() {
    this.modalStore.openModal(() =>
      import('@/shop/modal/add-promotion/add-promotion').then((m) => m.AddPromotion)
    );
  }
}
