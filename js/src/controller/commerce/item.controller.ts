import { ItemDto } from "@/models/commerce/item.model";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient } from "@prisma/client";

export class ItemController {
  private prisma = new PrismaClient();

  async findById(
    userId: bigint,
    orderId: bigint,
    itemId: bigint
  ): Promise<ItemDto> {
    const item = await this.prisma.item.findFirst({
      where: { order: { userId }, orderId, id: itemId },
      include: {
        discography: true,
        promotion: {
          include: { groupType: true, promotedCds: { select: { cdId: true } } },
        },
      },
    });
    if (!item) {
      throw new NotFoundException("No se ha encontrado el item");
    }
    return this.toDto(item);
  }

  async findByOrderId(userId: bigint, orderId: bigint): Promise<ItemDto[]> {
    const items = await this.prisma.item.findMany({
      where: { order: { userId }, orderId },
      include: {
        discography: true,
        promotion: {
          include: { groupType: true, promotedCds: { select: { cdId: true } } },
        },
      },
    });
    return items.map(this.toDto);
  }

  async create(
    userId: bigint,
    orderId: bigint,
    quantity: number,
    discographyId?: bigint,
    promotionId?: bigint
  ): Promise<void> {
    let unitPrice: number;
    let subtotal: number;
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) {
      throw new NotFoundException("No se ha encontrado la orden");
    }
    if (order.status !== "CART") {
      throw new BadRequestException("El pedido ya no puede ser modificado");
    }
    if (discographyId) {
      const discography = await this.prisma.discography.findFirst({
        where: { id: discographyId },
      });
      if (!discography) {
        throw new NotFoundException("No se ha encontrado la discografía");
      }
      const prev = await this.prisma.item.findFirst({
        where: { orderId, discographyId },
      });
      if (prev) {
        throw new ConflictException("Ya tienes esta discografía en tu pedido");
      }
      if (discography.stock && quantity > discography.stock) {
        throw new BadRequestException(
          "La cantidad solicitada es mayor que la disponible"
        );
      }
      unitPrice = discography.price.toNumber();
      subtotal = unitPrice * quantity;
    } else if (promotionId) {
      const promotion = await this.prisma.promotion.findFirst({
        where: { id: promotionId },
        include: {
          groupType: true,
          promotedCds: { include: { cd: { include: { discography: true } } } },
        },
      });
      if (!promotion) {
        throw new NotFoundException("No se ha encontrado la promoción");
      }
      const prev = await this.prisma.item.findFirst({
        where: { orderId, promotionId },
      });
      if (prev) {
        throw new ConflictException("Ya tienes esta promoción en tu pedido");
      }
      if (
        promotion.promotedCds
          .map((cd) => cd.cd.discography.stock)
          .some((stock) => stock !== null && quantity > stock)
      ) {
        throw new BadRequestException(
          `No hay stock suficiente para reclamar la promoción ${quantity} veces`
        );
      }
      unitPrice = promotion.promotedCds
        .map((cd) => cd.cd.discography.price.toNumber())
        .reduce((a, b) => a + b, 0);
      subtotal =
        quantity * (1 - promotion.groupType.discount.toNumber()) * unitPrice;
    } else {
      throw new BadRequestException(
        "No se ha seleccionado ninguna discografía o promoción"
      );
    }
    await this.prisma.$transaction([
      this.prisma.item.create({
        data: {
          orderId,
          discographyId,
          promotionId,
          quantity,
          unitPrice,
          subtotal,
        },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { total: { increment: subtotal } },
      }),
    ]);
  }

  async delete(userId: bigint, orderId: bigint, itemId: bigint): Promise<void> {
    const item = await this.prisma.item.findFirst({
      where: { order: { userId }, orderId, id: itemId },
      include: { order: true },
    });
    if (!item) {
      return;
    }
    if (item.order.status !== "CART") {
      throw new BadRequestException("El pedido ya no puede ser modificado");
    }
    await this.prisma.$transaction([
      this.prisma.item.delete({ where: { id: itemId } }),
      this.prisma.order.update({
        where: { id: orderId },
        data: { total: { decrement: item.subtotal } },
      }),
    ]);
  }

  private toDto(i: any): ItemDto {
    const d = {
      discographyId: i.discographyId === null ? null : Number(i.discographyId),
      discographyTitle: i.discography?.title,
      discographyArtist: i.discography?.artist,
      discographyImageUrl: i.discography?.imageUrl,
      discographyPrice: i.discography?.price.toNumber(),
      discographyRelease: i.discography?.release,
    };
    const p = {
      promotionId: i.promotionId === null ? null : Number(i.promotionId),
      promotionGroupTypeName: i.promotion?.groupType.name,
      promotionGroupTypeDiscount: i.promotion?.groupType.discount.toNumber(),
      promotionCdsDiscographyId: i.promotion?.promotedCds.map(
        (c: any) => c.cdId
      ),
    };
    return {
      id: Number(i.id),
      ...d,
      ...p,
      quantity: Number(i.quantity),
      unitPrice: i.unitPrice.toNumber(),
      subtotal: i.subtotal.toNumber(),
      createdAt: i.createdAt,
    };
  }
}

export const itemController = new ItemController();
