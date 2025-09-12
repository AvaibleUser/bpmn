export interface WishlistInfo {
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

export interface UpsertWishlist {
  paid: boolean;
}
