import { DiscographyDto } from "@/models/catalog/discography.model";
import { PromotionDto } from "@/models/commerce/promotion.model";
import * as z from "zod";

export interface ItemDto {
  id: number;
  discography: DiscographyDto | null;
  promotion: PromotionDto | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
}

export const upsertItem = z.object({
  quantity: z.number().min(1).nonoptional(),
});

export type UpsertItemDto = z.infer<typeof upsertItem>;
