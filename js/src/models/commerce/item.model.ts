import * as z from "zod";

export interface ItemDto {
  id: number;
  discographyId: number | null;
  discographyTitle: string | null;
  discographyArtist: string | null;
  discographyImageUrl: string | null;
  discographyPrice: number | null;
  discographyRelease: Date | null;
  promotionId: number | null;
  promotionGroupTypeName: string | null;
  promotionGroupTypeDiscount: number | null;
  promotionCdsDiscographyId: number[] | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
}

export const upsertItem = z.object({
  quantity: z.number().min(1).nonoptional(),
});

export type UpsertItemDto = z.infer<typeof upsertItem>;
