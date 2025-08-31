import { Discography } from '@/shop/components/discography/discography';
import { Filters } from '@/shop/components/filters/filters';
import { DiscographyQuery, DiscographyInfo } from '@/shop/models/discography.model';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Page } from '@shared/models/pageable.model';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'shop-products',
  imports: [CommonModule, LucideAngularModule, Discography, Filters],
  templateUrl: './products.html',
})
export class Products {
  readonly Previous = ChevronLeft;
  readonly Next = ChevronRight;
  readonly page = signal<number>(0);

  waitingFilter = false;

  filter(filters: DiscographyQuery = {}) {
    console.log({ ...filters, page: this.page() });
    setTimeout(() => {
      this.waitingFilter = false;
    }, 1000);
  }

  discographies: Page<DiscographyInfo> = {
    last: true,
    first: true,
    totalPages: 1,
    totalElements: 3,
    numberOfElements: 3,
    number: 0,
    size: 3,
    empty: false,
    content: [
      {
        id: 1,
        title: 'Safe As Milk',
        artist: 'Captain Beefheart',
        image_url: 'https://picsum.photos/id/10/200/300?id=1',
        genre: 'Rock',
        year: 2022,
        price: 100,
        stock: 10,
        format: 'VINYL',
        rating: 4,
        size: 7,
        special_edition: '20th Anniversary Edition',
        release: new Date(),
        created_at: new Date(),
      },
      {
        id: 2,
        title: 'Let It Enfold You',
        artist: 'Senses Fail',
        image_url: 'https://picsum.photos/id/10/200/300?id=2',
        genre: 'Rock',
        year: 2022,
        price: 100,
        stock: 10,
        format: 'CASSETTE',
        rating: 4,
        condition: 'NEW',
        created_at: new Date(),
      },
      {
        id: 3,
        title: 'Swimming [2LP]',
        artist: 'Mac Miller',
        image_url: 'https://picsum.photos/id/10/200/300?id=3',
        genre: 'Rock',
        year: 2022,
        price: 100,
        stock: 10,
        format: 'CD',
        rating: 4,
        created_at: new Date(),
      },
    ],
  };
}
