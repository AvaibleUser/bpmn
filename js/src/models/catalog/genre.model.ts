import * as z from "zod";

export interface GenreDto {
  id: number;
  name: string;
}

export const upsertGenre = z.object({
  name: z.string().nonempty().nonoptional(),
});

export type UpsertGenreDto = z.infer<typeof upsertGenre>;
