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

export const addUserDto = z.object({
  username: z.string().nonempty().nonoptional(),
  email: z.email().nonempty().nonoptional(),
  password: z.string().nonempty().nonoptional(),
  firstname: z.string().nonempty().nonoptional(),
  lastname: z.string().nonempty().nonoptional(),
});

export type AddUserDto = z.infer<typeof addUserDto>;

export const recoverDto = z.object({
  email: z.email().nonempty().nonoptional(),
});

export const resetDto = z.object({
  email: z.email().nonempty().nonoptional(),
  code: z.string().length(6).nonempty().nonoptional(),
  password: z.string().nonempty().nonoptional(),
  newPassword: z.string().nonempty().nonoptional(),
});

export const confirmDto = z.object({
  email: z.email().nonempty().nonoptional(),
  code: z.string().length(6).nonempty().nonoptional(),
});

export const changeActiveDto = z.object({
  active: z.boolean().nonoptional(),
});

export const changeRoleDto = z.object({
  role: z.enum(Object.values(Role)).nonoptional(),
});
