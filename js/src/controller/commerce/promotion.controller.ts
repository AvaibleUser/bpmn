import { PromotionDto, UpsertPromotionDto } from "@/models/commerce/promotion.model";
import {
  BadRequestException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient } from "@prisma/client";

export class PromotionController {
  private prisma = new PrismaClient();

  async findAll(): Promise<PromotionDto[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: { active: true },
      include: { promotedCds: { select: { cdId: true } } },
    });
    return promotions.map(this.toDto);
  }

  async findByCdId(cdId: bigint): Promise<PromotionDto[]> {
    const promotions = await this.prisma.promotion.findMany({
      where: { active: true, promotedCds: { some: { cdId } } },
      include: { promotedCds: { select: { cdId: true } } },
    });
    return promotions.map(this.toDto);
  }

  async findById(id: bigint): Promise<PromotionDto> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id, active: true },
      include: { promotedCds: { select: { cdId: true } } },
    });
    if (!promotion) {
      throw new NotFoundException("No se ha encontrado la promoción");
    }
    return this.toDto(promotion);
  }

  async create(groupId: bigint, promo: UpsertPromotionDto): Promise<void> {
    const group = await this.prisma.groupingType.findUnique({
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException("No se ha encontrado el grupo");
    }
    if (group.limitedTime) {
      if (!promo.endDate) {
        throw new BadRequestException("Falta la fecha de finalización");
      } else if (promo.endDate < promo.startDate) {
        throw new BadRequestException(
          "La fecha de finalización debe ser posterior a la de inicio"
        );
      }
    }
    if (
      promo.startDate < new Date() ||
      (promo.endDate && promo.endDate < new Date())
    ) {
      throw new BadRequestException(
        "Las fechas deben de ser posterior a la actual"
      );
    }
    const cds = await this.prisma.cd.count({
      where: { discographyId: { in: promo.cdIds } },
    });
    if (cds !== promo.cdIds.length) {
      throw new BadRequestException("No se encontraron todas los cds");
    }
    if (group.cdsLimit < cds) {
      throw new BadRequestException(
        `La promoción no puede superar el límite de ${group.cdsLimit} cds`
      );
    }
    await this.prisma.promotion.create({
      data: {
        groupTypeId: groupId,
        startDate: promo.startDate,
        endDate: promo.endDate,
        active: true,
        promotedCds: {
          create: promo.cdIds.map((cdId) => ({
            cd: { connect: { discographyId: cdId } },
          })),
        },
      },
    });
  }

  async update(
    id: bigint,
    groupId: bigint,
    promo: UpsertPromotionDto
  ): Promise<void> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id, active: true },
      include: { groupType: true, promotedCds: { select: { cdId: true } } },
    });
    if (!promotion) {
      throw new NotFoundException("No se ha encontrado la promoción");
    }
    if (promotion.groupType.id !== groupId) {
      throw new BadRequestException("El grupo no coincide");
    }
    if (promotion.groupType.limitedTime) {
      if (!promo.endDate) {
        throw new BadRequestException("Falta la fecha de finalización");
      } else if (promo.endDate < promo.startDate) {
        throw new BadRequestException(
          "La fecha de finalización debe ser posterior a la de inicio"
        );
      }
    }
    if (
      promo.startDate < new Date() ||
      (promo.endDate && promo.endDate < new Date())
    ) {
      throw new BadRequestException(
        "Las fechas deben de ser posterior a la actual"
      );
    }
    const cds = await this.prisma.cd.count({
      where: { discographyId: { in: promo.cdIds } },
    });
    if (cds !== promo.cdIds.length) {
      throw new BadRequestException("No se encontraron todas los cds");
    }
    if (promotion.groupType.cdsLimit < cds) {
      throw new BadRequestException(
        `La promoción no puede superar el límite de ${promotion.groupType.cdsLimit} cds`
      );
    }
    await this.prisma.promotion.update({
      where: { id },
      data: {
        startDate: promo.startDate,
        endDate: promo.endDate,
        promotedCds: {
          deleteMany: {},
          create: promo.cdIds.map((cdId) => ({
            cd: { connect: { discographyId: cdId } },
          })),
        },
      },
    });
  }

  async delete(id: bigint): Promise<void> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });
    if (!promotion) {
      return;
    }
    await this.prisma.promotion.update({
      where: { id },
      data: { active: false },
    });
  }

  private toDto(w: any): PromotionDto {
    return {
      id: Number(w.id),
      groupingTypeId: Number(w.groupingTypeId),
      startDate: w.startDate,
      endDate: w.endDate,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
      cdsDiscographyId: w.promotedCds.map((cd: any) => Number(cd.cdId)),
    };
  }
}

export const promotionController = new PromotionController();
