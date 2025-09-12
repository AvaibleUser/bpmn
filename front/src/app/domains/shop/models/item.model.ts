import { DiscographyInfo } from '@/shop/models/discography.model';
import { PromotionInfo } from '@/shop/models/promotion.model';

export interface Item {
  id: number;
  discography: DiscographyInfo | null;
  promotion: PromotionInfo | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
}

export interface UpsertItem {
  quantity: number;
}
