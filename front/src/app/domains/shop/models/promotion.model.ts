export interface CreatePromotion {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  cdIds: number[];
}

export interface Promotion {
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
