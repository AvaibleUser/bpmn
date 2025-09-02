import { Pageable } from '@shared/models/pageable.model';

export type Format = 'VINYL' | 'CASSETTE' | 'CD';

interface DiscographyCreate {
  title: string;
  artist: string;
  imageUrl?: string;
  genreId: number;
  year: number;
  price: number;
  stock?: number;
  format: Format;
  release?: Date;
}

export type VinylSize = 7 | 10 | 12;

export type VinylCreate = DiscographyCreate & {
  format: 'VINYL';
  size: VinylSize;
  specialEdition?: string;
};

export type CassetteCondition = 'NEW' | 'SEMI_USED' | 'USED';

export type CassetteCreate = DiscographyCreate & {
  format: 'CASSETTE';
  condition: CassetteCondition;
};

export type CdCreate = DiscographyCreate & {
  format: 'CD';
};

interface DiscographyExtras {
  id: number;
  rating: number;
  genre: string;
  createdAt: Date;
}

type Prefix<T, K extends string> = { [P in keyof T as `${K}${Capitalize<string & P>}`]: T[P] };

type Info<
  FormatExtras extends VinylCreate | CassetteCreate | CdCreate,
  PrefixKey extends string
> = DiscographyExtras &
  Omit<DiscographyCreate, 'genreId'> &
  Prefix<Omit<FormatExtras, keyof DiscographyCreate | 'genreId'>, PrefixKey> &
  Pick<FormatExtras, 'format'>;

export type Vinyl = Info<VinylCreate, 'vinyl'>;

export type Cassette = Info<CassetteCreate, 'cassette'>;

export type Cd = Info<CdCreate, 'cd'>;

export type DiscographyInfo = Vinyl | Cassette | Cd;

export type DiscographyQuery = Pageable<{
  genreId: number;
  stock: number;
  bestSellers: boolean;
  title: string;
  artist: string;
  year: number;
  priceMin: number;
  priceMax: number;
  format: Format | '';
}>;
