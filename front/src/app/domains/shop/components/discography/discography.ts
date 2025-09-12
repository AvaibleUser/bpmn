import { AddItem } from '@/shop/components/add-item/add-item';
import { DiscographyInfo } from '@/shop/models/discography.model';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Star } from 'lucide-angular';

@Component({
  selector: 'shop-discography',
  imports: [CommonModule, RouterModule, LucideAngularModule, AddItem],
  templateUrl: './discography.html',
})
export class Discography {
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;

  discography = input.required<DiscographyInfo>();

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
