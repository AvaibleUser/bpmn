import { Pageable } from '@shared/models/pageable.model';

export type Format = 'VINYL' | 'CASSETTE' | 'CD';

interface DiscographyCreateBase {
  title: string;
  artist: string;
  image_url?: string;
  genre_id: number;
  year: number;
  price: number;
  stock?: number;
  format: Format;
  release?: Date;
}

export type VinylSize = 7 | 10 | 12;

export type VinylCreate = DiscographyCreateBase & {
  format: 'VINYL';
  size: VinylSize;
  special_edition?: string;
};

export type CassetteCondition = 'NEW' | 'SEMI_USED' | 'USED';

export type CassetteCreate = DiscographyCreateBase & {
  format: 'CASSETTE';
  condition: CassetteCondition;
};

export type CdCreate = DiscographyCreateBase & {
  format: 'CD';
};

export type DiscographyCreate = VinylCreate | CassetteCreate | CdCreate;

interface DiscographyExtras {
  id: number;
  rating: number;
  genre: string;
  created_at: Date;
}

type Info<Create extends VinylCreate | CassetteCreate | CdCreate> = Omit<Create, 'genre_id'> &
  DiscographyExtras;

export type Vinyl = Info<VinylCreate>;

export type Cassette = Info<CassetteCreate>;

export type Cd = Info<CdCreate>;

export type DiscographyInfo = Vinyl | Cassette | Cd;

export type DiscographyQuery = Pageable<{
  genreId: number;
  title: string;
  artist: string;
  year: number;
  priceMin: number;
  priceMax: number;
  format: Format | '';
}>;
