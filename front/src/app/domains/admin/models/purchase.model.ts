export interface Purchase {
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

export interface AddPurchase {
  quantity: number;
  unitPrice: number;
}
