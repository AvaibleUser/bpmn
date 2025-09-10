import { DiscographyInfo } from '@/shop/models/discography.model';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Star } from 'lucide-angular';

@Component({
  selector: 'shop-discography',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './discography.html',
})
export class Discography {
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;

  discography = input.required<DiscographyInfo>();
}
