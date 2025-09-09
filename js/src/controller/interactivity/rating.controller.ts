import { RatingStatsDto } from "@/models/interactivity/rating.model";
import {
  ConflictException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient } from "@prisma/client";

export class RatingController {
  private prisma = new PrismaClient();

  async findStats(
    userId: bigint,
    discographyId: bigint
  ): Promise<RatingStatsDto> {
    const rating = await this.prisma.rating.aggregate({
      where: { discographyId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const userRating = await this.prisma.rating.findFirst({
      where: { userId, discographyId },
      select: { rating: true },
    });
    const eachStar = [5, 4, 3, 2, 1].map((rating) =>
      this.prisma.rating.count({
        where: { rating, discographyId },
      })
    );
    return {
      userRating: userRating?.rating,
      mean: rating._avg.rating || 0,
      total: rating._count.rating,
      fiveStars: await eachStar[0],
      fourStars: await eachStar[1],
      threeStars: await eachStar[2],
      twoStars: await eachStar[3],
      oneStar: await eachStar[4],
    };
  }

  async create(
    userId: bigint,
    discographyId: bigint,
    rating: number
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    const discography = await this.prisma.discography.findUnique({
      where: { id: discographyId },
    });
    if (!discography) {
      throw new NotFoundException("No se ha encontrado la discografía");
    }
    const prev = await this.prisma.rating.findFirst({
      where: { userId, discographyId },
    });
    if (prev) {
      throw new ConflictException("Ya has calificado esta discografía");
    }
    await this.prisma.rating.create({
      data: { userId, discographyId, rating },
    });
  }

  async update(
    userId: bigint,
    discographyId: bigint,
    rating: number
  ): Promise<void> {
    const prev = await this.prisma.rating.findFirst({
      where: { userId, discographyId },
    });
    if (!prev) {
      throw new NotFoundException("No has calificado esta discografía");
    }
    await this.prisma.rating.update({
      where: { id: prev.id },
      data: { rating },
    });
  }

  async delete(userId: bigint, discographyId: bigint): Promise<void> {
    const prev = await this.prisma.rating.findFirst({
      where: { userId, discographyId },
    });
    if (!prev) {
      return;
    }
    await this.prisma.rating.update({
      where: { id: prev.id },
      data: { deleted: true, deletedAt: new Date() },
    });
  }
}

export const ratingController = new RatingController();
