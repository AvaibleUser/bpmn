import { Status } from "@prisma/client";
import * as z from "zod";

export interface OrderDto {
  id: number;
  total: number;
  status: Status;
  createdAt: Date;
}

export const updateOrder = z.object({
  status: z.enum(Object.values(Status)).nonoptional(),
});

export type UpdateOrderDto = z.infer<typeof updateOrder>;

export const statusParam = z.object({
  status: z.enum(Object.values(Status)).optional(),
});
