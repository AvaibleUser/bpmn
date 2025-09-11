import { ProductsApi } from '@/shop/api/products-api';
import { Comments } from '@/shop/components/comments/comments';
import { Rating } from '@/shop/components/rating/rating';
import { Songs } from '@/shop/components/songs/songs';
import { Cassette, DiscographyInfo, Format, Vinyl } from '@/shop/models/discography.model';
import { Song } from '@/shop/models/song.model';
import { CommonModule, formatDate } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@shared/stores/auth-store';
import {
  AudioWaveform,
  BadgePercent,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  CalendarClock,
  CalendarHeart,
  CassetteTape,
  Disc3,
  Gem,
  LucideAngularModule,
  Quote,
  ShoppingCart,
  Turntable,
} from 'lucide-angular';

@Component({
  selector: 'shop-detail',
  imports: [CommonModule, LucideAngularModule, Comments, Rating, Songs],
  templateUrl: './detail.html',
})
export class Detail {
  private readonly authStore = inject(AuthStore);
  private readonly productsApi = inject(ProductsApi);
  private readonly router = inject(Router);

  readonly ShoppingCart = ShoppingCart;
  readonly Discount = BadgePercent;
  readonly Cd = Disc3;
  readonly Vinyl = Turntable;
  readonly Cassette = CassetteTape;
  readonly Genre = AudioWaveform;
  readonly Released = CalendarHeart;
  readonly Release = CalendarClock;
  readonly New = BatteryFull;
  readonly SemiUsed = BatteryMedium;
  readonly Used = BatteryLow;
  readonly Size = Quote;
  readonly Special = Gem;

  readonly id = input.required<number>({ alias: 'productId' });

  discography?: DiscographyInfo;
  songs?: Song[];
  authenticated?: boolean;
  userId?: number;

  constructor() {
    effect(() => {
      this.authenticated = !!this.authStore.session().token;
      this.userId = this.authStore.session().id;
      this.productsApi.getDiscography(this.id()).subscribe({
        next: (discography) => (this.discography = discography),
        error: () => {
          this.router.navigate(['/products']);
        },
      });
    });
  }

  formatStr(format: Format) {
    switch (format) {
      case 'CD':
        return 'CD';
      case 'CASSETTE':
        return 'Cassette';
      case 'VINYL':
        return 'Vinilo';
    }
  }

  formatIcon(format: Format) {
    switch (format) {
      case 'CD':
        return this.Cd;
      case 'CASSETTE':
        return this.Cassette;
      case 'VINYL':
        return this.Vinyl;
    }
  }

  discounted(cassette: Cassette): number {
    switch (cassette.cassetteCondition) {
      case 'SEMI_USED':
        return cassette.price * 0.8; // 20% discount
      case 'USED':
        return cassette.price * 0.5; // 50% discount
      default:
        return cassette.price;
    }
  }

  discount(cassette: Cassette): number {
    switch (cassette.cassetteCondition) {
      case 'SEMI_USED':
        return 0.2;
      case 'USED':
        return 0.5;
      default:
        return 0;
    }
  }

  conditionStr(discography: DiscographyInfo) {
    if (discography.format !== 'CASSETTE') {
      return;
    }
    switch (discography.cassetteCondition) {
      case 'NEW':
        return 'Nuevo';
      case 'SEMI_USED':
        return 'Semi Usado';
      case 'USED':
        return 'Usado';
    }
  }

  conditionIcon(discography: DiscographyInfo) {
    if (discography.format !== 'CASSETTE') {
      return;
    }
    switch (discography.cassetteCondition) {
      case 'NEW':
        return this.New;
      case 'SEMI_USED':
        return this.SemiUsed;
      case 'USED':
        return this.Used;
    }
  }

  details(discography: DiscographyInfo) {
    return [
      {
        icon: this.formatIcon(discography.format),
        label: 'Formato',
        value: this.formatStr(discography.format),
      },
      { icon: this.Genre, label: 'Genero', value: discography.genreName },
      { icon: this.Released, label: 'Año de lanzamiento', value: discography.year },
      {
        icon: this.Release,
        label: 'Fecha de lanzamiento',
        value: !discography.release || formatDate(discography.release, 'dd/MM/yyyy', 'en-US'),
        condition: !!discography.release,
      },
      {
        icon: this.conditionIcon(discography),
        label: 'Condición',
        value: this.conditionStr(discography),
        condition: discography.format === 'CASSETTE',
      },
      {
        icon: this.Size,
        label: 'Tamaño',
        value: `${(discography as Vinyl).vinylSize}"`,
        condition: discography.format === 'VINYL',
      },
      {
        icon: this.Special,
        label: 'Edición especial',
        value: (discography as Vinyl).vinylSpecialEdition,
        condition: !!(discography as Vinyl).vinylSpecialEdition,
      },
    ];
  }
}
