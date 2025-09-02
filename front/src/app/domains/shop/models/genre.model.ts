export interface GenreCreate {
  name: string;
}

export type Genre = GenreCreate & {
  id: number;
};
