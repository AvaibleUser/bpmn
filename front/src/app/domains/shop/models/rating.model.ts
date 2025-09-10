export interface RatingStats {
  userRating: number;
  mean: number;
  total: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

export interface RatingCreate {
  rating: number;
}
