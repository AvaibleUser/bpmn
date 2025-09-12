import { CommerceApi } from '@/shop/api/commerce-api';
import { WishlistInfo } from '@/shop/models/wishlist.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertStore } from '@shared/stores/alert-store';
import { Heart, HeartHandshake, LucideAngularModule, ShoppingBag, Trash2 } from 'lucide-angular';

@Component({
  selector: 'commerce-wishlist',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './wishlist.html',
})
export class Wishlist implements OnInit {
  private readonly commerceApi = inject(CommerceApi);
  private readonly alertStore = inject(AlertStore);
  private readonly router = inject(Router);

  readonly Heart = Heart;
  readonly Preventa = HeartHandshake;
  readonly ShoppingBag = ShoppingBag;
  readonly Delete = Trash2;

  wishlistItems: WishlistInfo[] = [];
  loading = false;
  activeTab: 'wishlist' | 'preventa' = 'wishlist';

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.commerceApi.getWishlists().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.alertStore.addAlert({
          message: error.error?.message || 'Error al cargar la lista de deseos',
          type: 'error',
        });
        this.loading = false;
      },
    });
  }

  get filteredItems(): WishlistInfo[] {
    return this.wishlistItems.filter((item) =>
      this.activeTab === 'wishlist' ? !item.paid : item.paid
    );
  }

  get wishlistCount(): number {
    return this.wishlistItems.filter((item) => !item.paid).length;
  }

  get preventaCount(): number {
    return this.wishlistItems.filter((item) => item.paid).length;
  }

  setActiveTab(tab: 'wishlist' | 'preventa') {
    this.activeTab = tab;
  }

  removeFromWishlist(discographyId: number) {
    const item = this.wishlistItems.find((item) => item.discographyId === discographyId);
    if (!item) {
      return;
    }

    const itemType = item.paid ? 'preventa' : 'lista de deseos';

    this.alertStore.addAlert({
      message: `¿Estás seguro de eliminar "${item.discographyTitle}" de tu ${itemType}?`,
      type: 'error',
      accept: () => {
        this.commerceApi.removeFromWishlist(discographyId).subscribe({
          next: () => {
            this.wishlistItems = this.wishlistItems.filter(
              (item) => item.discographyId !== discographyId
            );
            this.alertStore.addAlert({
              message: `Producto eliminado de tu ${itemType}`,
              type: 'success',
            });
          },
          error: (error: HttpErrorResponse) => {
            this.alertStore.addAlert({
              message: error.error?.message || 'Error al eliminar el producto',
              type: 'error',
            });
          },
        });
      },
    });
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/shop/products', productId]);
  }
}
