import { AddItem } from '@/shop/components/add-item/add-item';
import { PromotionInfo } from '@/shop/models/promotion.model';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'shop-promotion',
  imports: [CommonModule, RouterModule, LucideAngularModule, AddItem],
  templateUrl: './promotion.html',
  styles: ``,
})
export class Promotion {
  readonly ShoppingCart = ShoppingCart;

  promotion = input.required<PromotionInfo>();

  waiting = false;

  discounted(promotion: PromotionInfo): number {
    return (1 - promotion.groupTypeDiscount) * promotion.cds.reduce((acc, b) => acc + b.price, 0);
  }

  stock(promotion: PromotionInfo): number {
    return Math.min(...promotion.cds.map((cd) => cd.stock).filter((stock) => stock !== null));
  }
}
