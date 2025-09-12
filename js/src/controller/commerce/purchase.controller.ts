import { PurchaseDto } from "@/models/commerce/purchase.model";
import { NotFoundException } from "@/models/util/exception.model";
import { PrismaClient } from "@prisma/client";

export class PurchaseController {
  private prisma = new PrismaClient();

  async findById(id: bigint): Promise<PurchaseDto> {
    const purchase = await this.prisma.purchase.findFirst({
      where: { id },
      include: { discography: true, user: { select: { username: true } } },
    });
    if (!purchase) {
      throw new NotFoundException("No se ha encontrado la compra");
    }
    return this.toDto(purchase);
  }

  async findByUserId(userId: bigint): Promise<PurchaseDto[]> {
    const purchases = await this.prisma.purchase.findMany({
      where: { userId },
      include: { discography: true, user: { select: { username: true } } },
    });
    return purchases.map(this.toDto);
  }

  async findAll(): Promise<PurchaseDto[]> {
    const purchases = await this.prisma.purchase.findMany({
      include: { discography: true, user: { select: { username: true } } },
    });
    return purchases.map(this.toDto);
  }

  async create(userId: bigint, discographyId: bigint, quantity: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.active || user.banned) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    const discography = await this.prisma.discography.findUnique({
      where: { id: discographyId },
    });
    if (!discography || !discography.visible) {
      throw new NotFoundException("No se ha encontrado la discografía");
    }
    this.prisma.$transaction([
      this.prisma.purchase.create({
        data: {
          userId,
          discographyId,
          quantity,
          unitPrice: discography.price,
          total: discography.price.mul(quantity),
        },
      }),
      this.prisma.discography.update({
        where: { id: discographyId },
        data: { stock: (discography.stock || 0) + quantity },
      }),
    ]);
  }

  private toDto(p: any): PurchaseDto {
    return {
      id: Number(p.id),
      userId: Number(p.userId),
      username: p.user.username,
      discographyId: Number(p.discographyId),
      discographyTitle: p.discography.title,
      discographyArtist: p.discography.artist,
      discographyImageUrl: p.discography.imageUrl,
      discographyPrice: p.discography.price.toNumber(),
      discographyRelease: p.discography.release,
      quantity: Number(p.quantity),
      unitPrice: p.unitPrice.toNumber(),
      total: p.total.toNumber(),
      createdAt: p.createdAt,
    };
  }
}

export const purchaseController = new PurchaseController();
