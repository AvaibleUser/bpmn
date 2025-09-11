import { Role } from "@prisma/client";
import * as z from "zod";

export const authDto = z.object({
  email: z.email().nonempty().nonoptional(),
  password: z.string().nonempty().nonoptional(),
});

export type AuthDto = z.infer<typeof authDto>;

export type Authentication<T> = AuthDto & {
  [key: string]: any;
  authorities: T[];
};

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: Role;
  firstname: string;
  lastname: string;
  verified: boolean;
  active: boolean;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export type Token = UserDto & {
  token: string;
};

export const addUser = z.object({
  username: z.string().nonempty().nonoptional(),
  email: z.email().nonempty().nonoptional(),
  password: z.string().nonempty().nonoptional(),
  firstname: z.string().nonempty().nonoptional(),
  lastname: z.string().nonempty().nonoptional(),
});

export type AddUserDto = z.infer<typeof addUser>;

export const recover = z.object({
  email: z.email().nonempty().nonoptional(),
});

export const reset = z.object({
  email: z.email().nonempty().nonoptional(),
  code: z.string().length(6).nonempty().nonoptional(),
  password: z.string().nonempty().nonoptional(),
  newPassword: z.string().nonempty().nonoptional(),
});

export const confirm = z.object({
  email: z.email().nonempty().nonoptional(),
  code: z.string().length(6).nonempty().nonoptional(),
});

export const changeActive = z.object({
  active: z.boolean().nonoptional(),
});

export const changeRole = z.object({
  role: z.enum(Object.values(Role)).nonoptional(),
});
