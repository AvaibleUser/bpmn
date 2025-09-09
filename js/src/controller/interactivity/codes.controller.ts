import { PrismaClient } from "@prisma/client";

export class CodesController {
  private prisma = new PrismaClient();

  async generateCode(userId: bigint | number): Promise<string> {
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    await this.prisma.userCode.create({
      data: { code, userId, expiresAt: new Date(Date.now() + 1000 * 30) },
      select: { code: true },
    });
    return code;
  }

  async confirmCode(email: string, code: string): Promise<boolean> {
    const userCode = await this.prisma.userCode.findFirst({
      where: { code, user: { email }, expiresAt: { gt: new Date() } },
    });
    if (userCode) {
      await this.prisma.userCode.update({
        where: { id: userCode.id },
        data: { used: true },
      });
      return true;
    }
    return false;
  }
}

export const codesController = new CodesController();
