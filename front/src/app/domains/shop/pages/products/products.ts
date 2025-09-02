import { ProductsApi } from '@/shop/api/products-api';
import { Discography } from '@/shop/components/discography/discography';
import { Filters } from '@/shop/components/filters/filters';
import { DiscographyInfo, DiscographyQuery } from '@/shop/models/discography.model';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Page, WithPage } from '@shared/models/pageable.model';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'shop-products',
  imports: [CommonModule, LucideAngularModule, Discography, Filters],
  templateUrl: './products.html',
})
export class Products extends WithPage<DiscographyInfo> implements OnInit {
  private readonly productsApi = inject(ProductsApi);

  readonly Previous = ChevronLeft;
  readonly Next = ChevronRight;
  readonly page = signal<number>(0);

  waitingFilter = false;
  discographies?: Page<DiscographyInfo>;

  ngOnInit() {
    this.filter();
  }

  filter(filters: DiscographyQuery = {}) {
    this.productsApi.getDiscographies({ ...filters, size: 9 }).subscribe((discographies) => {
      this.discographies = discographies;
      this.page.set(discographies.page.number);
      this.waitingFilter = false;
    });
  }
}
