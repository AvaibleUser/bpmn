import { Side } from "@prisma/client";
import * as z from "zod";

export interface SongDto {
  id: number;
  discographyId: number;
  name: string;
  side: Side | null;
  url: string | null;
}

export const upsertSong = z.object({
  name: z.string().nonempty().nonoptional(),
  side: z.enum(Object.values(Side)).optional(),
  url: z.string().nonempty().optional(),
});

export type UpsertSongDto = z.infer<typeof upsertSong>;
