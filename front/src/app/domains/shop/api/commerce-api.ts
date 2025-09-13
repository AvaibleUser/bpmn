import { AddPurchase, Purchase } from '@/admin/models/purchase.model';
import { GroupType } from '@/shop/models/group.model';
import { Item, UpsertItem } from '@/shop/models/item.model';
import { Order, Status } from '@/shop/models/order.model';
import { CreatePromotion, PromotionInfo } from '@/shop/models/promotion.model';
import { UpsertWishlist, WishlistInfo } from '@/shop/models/wishlist.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Page, Pageable } from '@shared/models/pageable.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommerceApi {
  private readonly api = `${environment.apiUrl}`;
  private readonly http = inject(HttpClient);

  getOrders(status?: Status): Observable<Order[]> {
    const params = Object.entries({ status }).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string | number | boolean>);
    return this.http.get<Order[]>(`${this.api}/orders`, { params });
  }

  createOrder(): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.api}/orders`, {});
  }

  payOrder(orderId: number): Observable<void> {
    return this.http.put<void>(`${this.api}/orders/${orderId}/complete`, {});
  }

  sendOrder(orderId: number): Observable<void> {
    return this.http.put<void>(`${this.api}/orders/${orderId}/send`, { status: 'SENT' });
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/orders/${orderId}`);
  }

  getItems(orderId: number): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.api}/orders/${orderId}/items`);
  }

  createItem(
    productId: number,
    product: 'discographies' | 'promotions',
    item: UpsertItem
  ): Observable<void> {
    const item$ = new Subject<void>();
    this.getOrders('CART').subscribe({
      next: (orders) => {
        const sendItem = (orderId: number) => {
          this.http
            .post<void>(`${this.api}/orders/${orderId}/items/${product}/${productId}`, item)
            .subscribe({
              next: () => item$.next(),
              error: (error) => item$.error(error),
            });
        };
        const order = orders.find((o) => o.status === 'CART');
        if (order) {
          sendItem(order.id);
          return;
        }
        this.createOrder().subscribe({
          next: ({ id }) => sendItem(id),
          error: (error) => item$.error(error),
        });
      },
      error: (error) => item$.error(error),
    });
    return item$.asObservable();
  }

  deleteItem(orderId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/orders/${orderId}/items/${itemId}`);
  }

  getPromotions(pageable: Pageable<{}> = {}): Observable<Page<PromotionInfo>> {
    return this.http.get<Page<PromotionInfo>>(`${this.api}/promotions`, { params: pageable });
  }

  getCdPromotions(cdId: number): Observable<PromotionInfo[]> {
    return this.http.get<PromotionInfo[]>(`${this.api}/discographies/${cdId}/promotions`);
  }

  getPromotion(promotionId: number): Observable<PromotionInfo> {
    return this.http.get<PromotionInfo>(`${this.api}/promotions/${promotionId}`);
  }

  createPromotion(groupId: number, promotion: CreatePromotion): Observable<void> {
    return this.http.post<void>(`${this.api}/groups/${groupId}/promotions`, promotion);
  }

  deletePromotion(promotionId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/promotions/${promotionId}`);
  }

  getGroups(): Observable<GroupType[]> {
    return this.http.get<GroupType[]>(`${this.api}/groups`);
  }

  getWishlists(paid?: boolean): Observable<WishlistInfo[]> {
    const params = Object.entries({ paid }).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string | number | boolean>);
    return this.http.get<WishlistInfo[]>(`${this.api}/wishlists`, { params });
  }

  createWishlist(discographyId: number, request: UpsertWishlist): Observable<void> {
    return this.http.post<void>(`${this.api}/discographies/${discographyId}/wishlists`, request);
  }

  updateWishlist(discographyId: number, request: UpsertWishlist): Observable<void> {
    return this.http.put<void>(`${this.api}/discographies/${discographyId}/wishlists`, request);
  }

  removeFromWishlist(discographyId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/discographies/${discographyId}/wishlists`);
  }

  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.api}/purchases`);
  }

  createPurchase(discographyId: number, purchase: AddPurchase): Observable<void> {
    return this.http.post<void>(`${this.api}/discographies/${discographyId}/purchases`, purchase);
  }
}
