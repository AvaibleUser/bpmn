import * as z from "zod";

export interface WishlistDto {
  id: number;
  userId: number;
  username: string;
  discographyId: number;
  discographyTitle: string;
  discographyArtist: string;
  discographyImageUrl: string | null;
  discographyPrice: number;
  discographyRelease: Date | null;
  paid: boolean;
  createdAt: Date;
}

export const upsertWishlist = z.object({
  paid: z.boolean().default(false),
});

export const paidParam = z.object({
  paid: z.string().pipe(z.coerce.boolean()).optional(),
});
