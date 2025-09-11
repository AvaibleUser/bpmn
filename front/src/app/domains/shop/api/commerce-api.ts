import { UpsertItem } from '@/shop/models/item.model';
import { Order, Status } from '@/shop/models/order.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment.development';
import { Observable } from 'rxjs';

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

  createOrder(): Observable<void> {
    return this.http.post<void>(`${this.api}/orders`, {});
  }

  payOrder(orderId: number): Observable<void> {
    return this.http.put<void>(`${this.api}/orders/${orderId}/complete`, {});
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/orders/${orderId}`);
  }

  getItems(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.api}/orders/${orderId}/items`);
  }

  createDiscographyItem(
    orderId: number,
    discographyId: number,
    item: UpsertItem
  ): Observable<void> {
    return this.http.post<void>(
      `${this.api}/orders/${orderId}/items/discographies/${discographyId}`,
      item
    );
  }

  createPromotionItem(orderId: number, promotionId: number, item: UpsertItem): Observable<void> {
    return this.http.post<void>(
      `${this.api}/orders/${orderId}/items/promotions/${promotionId}`,
      item
    );
  }

  deleteItem(orderId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/orders/${orderId}/items/${itemId}`);
  }
}
