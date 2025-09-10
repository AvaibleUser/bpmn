import { pageable } from "@/models/util/util.model";
import { Condition, Format, Prisma } from "@prisma/client";
import * as z from "zod";

export const filterDiscography = z
  .object({
    title: z.string(),
    artist: z.string(),
    genreId: z.string().pipe(z.coerce.bigint()),
    stock: z.string().pipe(z.coerce.number()),
    bestSellers: z.string().pipe(z.coerce.boolean()),
    year: z.string().pipe(z.coerce.number()),
    priceMin: z.string().pipe(z.coerce.number()),
    priceMax: z.string().pipe(z.coerce.number()),
    format: z.enum(Object.values(Format)),
    released: z.string().pipe(z.coerce.boolean()),
  })
  .partial()
  .and(pageable);

export type FilterDiscography = z.infer<typeof filterDiscography>;

export type DiscographyDto = {
  id: number;
  title: string;
  artist: string;
  imageUrl: string | null;
  genreName: string;
  year: number;
  price: number;
  stock: number | null;
  format: Format;
  visible: boolean;
  release: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  cassetteCondition?: Condition;
  vinylSize?: number;
  vinylSpecialEdition?: string | null;
  rating?: number;
};

const addCassette = z.object({
  cassetteCondition: z.enum(Object.values(Condition)).optional(),
});

const addVinyl = z.object({
  vinylSize: z.int().optional(),
  vinylSpecialEdition: z.string().optional(),
});

export const addDiscography = z
  .object({
    title: z.string().nonempty().nonoptional(),
    artist: z.string().nonempty().nonoptional(),
    imageUrl: z.string().optional(),
    genreId: z.int().positive().nonoptional(),
    year: z.int().positive().nonoptional(),
    price: z.number().positive().nonoptional(),
    stock: z.int().nonnegative().optional(),
    format: z.enum(Object.values(Format)).nonoptional(),
    visible: z.boolean().default(false),
    release: z.date().optional(),
  })
  .and(addCassette)
  .and(addVinyl);

export type AddDiscographyDto = z.infer<typeof addDiscography>;
