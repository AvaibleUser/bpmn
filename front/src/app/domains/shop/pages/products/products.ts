import { ProductsApi } from '@/shop/api/products-api';
import { Discography } from '@/shop/components/discography/discography';
import { Filters } from '@/shop/components/filters/filters';
import { DiscographyInfo, DiscographyQuery } from '@/shop/models/discography.model';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Role } from '@core/auth/models/auth.model';
import { Page, WithPage } from '@shared/models/pageable.model';
import { AuthStore } from '@shared/stores/auth-store';
import { ModalStore } from '@shared/stores/modal-store';
import { ChevronLeft, ChevronRight, LucideAngularModule, Music, PackagePlus } from 'lucide-angular';

@Component({
  selector: 'shop-products',
  imports: [CommonModule, LucideAngularModule, Discography, Filters],
  templateUrl: './products.html',
})
export class Products extends WithPage<DiscographyInfo> {
  private readonly productsApi = inject(ProductsApi);
  private readonly authStore = inject(AuthStore);
  private readonly modalStore = inject(ModalStore);

  readonly Previous = ChevronLeft;
  readonly Next = ChevronRight;
  readonly Plus = PackagePlus;
  readonly Music = Music;

  readonly page = signal<number>(0);

  userRole?: Role;
  waitingFilter = false;
  discographies?: Page<DiscographyInfo>;

  constructor() {
    super();
    effect(() => {
      this.waitingFilter = true;
      this.userRole = this.authStore.session().token ? this.authStore.session().role : undefined;
      this.filter({ page: this.page() });
    });
  }

  filter(filters: DiscographyQuery = {}) {
    this.productsApi.getDiscographies({ ...filters, size: 9 }).subscribe((discographies) => {
      this.discographies = discographies;
      this.page.set(discographies.page.number);
      this.waitingFilter = false;
    });
  }

  addProduct() {
    this.modalStore.openModal(() =>
      import('@/shop/modal/add-product/add-product').then((m) => m.AddProduct)
    );
  }
}
