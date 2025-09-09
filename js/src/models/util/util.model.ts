import { Role } from "@prisma/client";
import { JwtVariables } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import * as z from "zod";

export type Jwt = JWTPayload & {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  role: Role[];
};

export type App = { Variables: JwtVariables<Jwt> };

export const pageable = z.object({
  page: z.string().default("0").pipe(z.coerce.number()),
  size: z.string().default("20").pipe(z.coerce.number()),
  sort: z.string().optional(),
  order: z.string().optional(),
});

export interface PageModel<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const idParam = z.object({ id: z.string().pipe(z.coerce.bigint()) });

export const otherIdParam = <T extends string>(idName: T) =>
  z.object({ [idName]: z.string().pipe(z.coerce.bigint()) });

export const image = z.object({ image: z.instanceof(File) });

export const song = z.object({ song: z.instanceof(File) });
