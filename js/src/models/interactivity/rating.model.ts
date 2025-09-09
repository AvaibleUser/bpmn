import * as z from "zod";

export interface RatingStatsDto {
  userRating?: number;
  mean: number;
  total: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

export interface RatingDto {
  id: number;
  rating: number;
}

export const upsertRating = z.object({
  rating: z.number().min(1).max(5).nonoptional(),
});

export type UpsertRatingDto = z.infer<typeof upsertRating>;
