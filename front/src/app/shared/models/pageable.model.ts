export type Nullable<T> = { [P in keyof T]?: T[P] | null | undefined };

export type Filter<T extends object> = Nullable<T>;

export type Pageable<T extends object> = Filter<T> & {
  page?: number;
  size?: number;
  sort?: string[];
};

export type Page<T extends object> = {
  content: T[];
  last?: boolean;
  first?: boolean;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  pageable?: {
    pageNumber?: number;
    pageSize?: number;
    offset?: number;
  };
  number?: number;
  size?: number;
  empty?: boolean;
};
