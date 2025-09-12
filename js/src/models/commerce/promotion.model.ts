import * as z from "zod";

export interface PromotionDto {
  id: number;
  name: string;
  description: string;
  groupTypeId: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  groupTypeDiscount: number;
  cds: {
    id: number;
    title: string;
    artist: string;
    imageUrl: string | null;
    genreName: string;
    price: number;
    stock: number | null;
  }[];
}

export const upsertPromotion = z.object({
  name: z.string().nonempty().nonoptional(),
  description: z.string().nonempty().nonoptional(),
  startDate: z.coerce.date().nonoptional(),
  endDate: z.coerce.date().optional(),
  cdIds: z.array(z.coerce.bigint()).nonempty().nonoptional(),
});

export type UpsertPromotionDto = z.infer<typeof upsertPromotion>;
