import { WishlistDto } from "@/models/commerce/wishlist.model";
import {
  ConflictException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient } from "@prisma/client";

export class WishlistController {
  private prisma = new PrismaClient();

  async findById(id: bigint): Promise<WishlistDto> {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { id },
      include: { discography: true, user: { select: { username: true } } },
    });
    if (!wishlist) {
      throw new NotFoundException("No se ha encontrado la wishlist");
    }
    return this.toDto(wishlist);
  }

  async findByUserId(userId: bigint, paid?: boolean): Promise<WishlistDto[]> {
    const wishlists = await this.prisma.wishlist.findMany({
      where: { userId, paid },
      include: { discography: true, user: { select: { username: true } } },
    });
    return wishlists.map(this.toDto);
  }

  async findByDiscographyId(discographyId: bigint): Promise<WishlistDto[]> {
    const wishlists = await this.prisma.wishlist.findMany({
      where: { discographyId },
      include: { discography: true, user: { select: { username: true } } },
    });
    return wishlists.map(this.toDto);
  }

  async create(
    userId: bigint,
    discographyId: bigint,
    paid: boolean
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
    const prev = await this.prisma.wishlist.findFirst({
      where: { userId, discographyId },
    });
    if (prev) {
      throw new ConflictException("Ya tienes esta discografía en tu wishlist");
    }
    await this.prisma.wishlist.create({
      data: { userId, discographyId, paid },
    });
  }

  async update(
    userId: bigint,
    discographyId: bigint,
    paid: boolean
  ): Promise<void> {
    const prev = await this.prisma.wishlist.findFirst({
      where: { userId, discographyId },
    });
    if (!prev) {
      throw new NotFoundException("No tienes esta discografía en tu wishlist");
    }
    await this.prisma.wishlist.update({
      where: { id: prev.id },
      data: { paid },
    });
  }

  async delete(userId: bigint, discographyId: bigint): Promise<void> {
    const prev = await this.prisma.wishlist.findFirst({
      where: { userId, discographyId },
    });
    if (!prev) {
      return;
    }
    await this.prisma.wishlist.delete({ where: { id: prev.id } });
  }

  private toDto(w: any): WishlistDto {
    return {
      id: Number(w.id),
      userId: Number(w.userId),
      username: w.user.username,
      discographyId: Number(w.discographyId),
      discographyTitle: w.discography.title,
      discographyArtist: w.discography.artist,
      discographyImageUrl: w.discography.imageUrl,
      discographyPrice: w.discography.price.toNumber(),
      discographyRelease: w.discography.release,
      paid: w.paid,
      createdAt: w.createdAt,
    };
  }
}

export const wishlistController = new WishlistController();
