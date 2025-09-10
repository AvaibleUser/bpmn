import { GroupTypeDto } from "@/models/commerce/group.model";
import { PrismaClient } from "@prisma/client";

export class GroupController {
  private prisma = new PrismaClient();

  async findAll(): Promise<GroupTypeDto[]> {
    return (await this.prisma.groupingType.findMany()).map((g) => ({
      id: Number(g.id),
      name: g.name,
      discount: g.discount.toNumber(),
      cdsLimit: g.cdsLimit,
      limitedTime: g.limitedTime,
    }));
  }
}

export const groupController = new GroupController();
