import * as z from "zod";

export interface PurchaseDto {
  id: number;
  userId: number;
  username: string;
  discographyId: number;
  discographyTitle: string;
  discographyArtist: string;
  discographyImageUrl: string | null;
  discographyPrice: number;
  discographyRelease: Date | null;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: Date;
}

export const addPurchase = z.object({
  quantity: z.number().min(1).nonoptional(),
  unitPrice: z.number().positive().nonoptional(),
});

export type AddPurchaseDto = z.infer<typeof addPurchase>;
