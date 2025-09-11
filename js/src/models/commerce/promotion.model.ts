import * as z from "zod";

export interface PromotionDto {
  id: number;
  groupingTypeId: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  cdsDiscographyId: number[];
}

export const upsertPromotion = z.object({
  startDate: z.coerce.date().nonoptional(),
  endDate: z.coerce.date().optional(),
  cdIds: z.array(z.bigint()).nonempty().nonoptional(),
});

export type UpsertPromotionDto = z.infer<typeof upsertPromotion>;
