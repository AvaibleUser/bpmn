import { s3Controller as storage } from "@/controller/util/storage.controller";
import {
  AddDiscographyDto,
  DiscographyDto,
  FilterDiscography,
} from "@/models/catalog/discography.model";
import {
  BadRequestException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PageModel } from "@/models/util/util.model";
import { DiscographySpecification } from "@/specifications/discography.specification";
import { Format, Prisma, PrismaClient } from "@prisma/client";

export class DiscographyController {
  private prisma = new PrismaClient();
  private specification = new DiscographySpecification();

  async findAll(filter: FilterDiscography): Promise<PageModel<DiscographyDto>> {
    const filters = [
      this.specification.byTitleWith(filter.title),
      this.specification.byArtistWith(filter.artist),
      this.specification.byGenreWithId(filter.genreId),
      this.specification.byYear(filter.year),
      this.specification.byPriceGreaterThan(filter.priceMin),
      this.specification.byPriceLessThan(filter.priceMax),
      this.specification.byStock(filter.stock),
      this.specification.byFormat(filter.format),
      this.specification.byVisible(),
      this.specification.byNonDeleted(),
    ] as Prisma.DiscographyWhereInput[];
    const elements = await this.prisma.discography.count({
      where: { AND: filters },
    });
    const page = {
      size: filter.size,
      number: filter.page,
      totalElements: elements,
      totalPages: Math.ceil(elements / filter.size),
    };
    const rawFilters = [
      this.specification.byTitleRaw(filter.title),
      this.specification.byArtistRaw(filter.artist),
      this.specification.byGenreRaw(filter.genreId),
      this.specification.byYearRaw(filter.year),
      this.specification.byPriceGreaterThanRaw(filter.priceMin),
      this.specification.byPriceLessThanRaw(filter.priceMax),
      this.specification.byStockRaw(filter.stock),
      this.specification.byFormatRaw(filter.format),
      this.specification.byVisibleRaw(),
      this.specification.byNonDeletedRaw(),
    ];
    const result: any = await this.prisma.$queryRaw`
        SELECT 
          d.id,
          d.title,
          d.artist,
          d.image_url,
          d.year,
          d.price,
          d.stock,
          d.format,
          d.visible,
          d.release,
          d.created_at,
          d.updated_at,
          g.name as genre_name,
          c.condition as cassette_condition,
          v.size as vinyl_size,
          v.special_edition as vinyl_special_edition,
          ROUND(AVG(r.rating)) as rating
        FROM 
          catalog.discographies d
        JOIN catalog.genres g ON d.genre_id = g.id
        LEFT JOIN catalog.cassettes c ON d.id = c.discography_id
        LEFT JOIN catalog.vinyls v ON d.id = v.discography_id
        LEFT JOIN catalog.cds cd ON d.id = cd.discography_id
        LEFT JOIN interactivity.ratings r ON d.id = r.discography_id
        LEFT JOIN (commerce.order_items i JOIN commerce.orders o
          ON i.order_id = o.id AND o.status <> 'CART')  ON d.id = i.discography_id
        WHERE ${Prisma.join(
          rawFilters.filter((f) => f),
          " AND "
        )}
        GROUP BY 
          d.id, g.id, c.discography_id, v.discography_id, cd.discography_id
        ${
          filter.bestSellers !== undefined
            ? Prisma.sql`ORDER BY COALESCE(SUM(i.quantity), 0) DESC`
            : Prisma.empty
        }
        LIMIT ${filter.size}
        OFFSET ${filter.page * filter.size}
    `;
    return {
      content: result.map((d: any) => {
        return {
          id: Number(d.id),
          title: d.title,
          artist: d.artist,
          imageUrl: d.image_url,
          year: d.year,
          price: d.price.toNumber(),
          stock: d.stock,
          format: d.format,
          visible: d.visible,
          release: d.release,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          genreName: d.genre_name,
          cassetteCondition: d.cassette_condition,
          vinylSize: d.vinyl_size,
          vinylSpecialEdition: d.vinyl_special_edition,
          rating: d.rating,
        } as DiscographyDto;
      }),
      page,
    };
  }

  async findById(id: bigint): Promise<DiscographyDto> {
    const result: any = await this.prisma.discography.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        artist: true,
        imageUrl: true,
        year: true,
        price: true,
        stock: true,
        format: true,
        visible: true,
        release: true,
        createdAt: true,
        updatedAt: true,
        genre: { select: { name: true } },
        cassette: { select: { condition: true } },
        vinyl: { select: { size: true, specialEdition: true } },
        ratings: { select: { rating: true } },
      },
    });
    if (!result) {
      throw new NotFoundException("No se ha encontrado la discografía");
    }
    return this.toDto(result);
  }

  async create(d: AddDiscographyDto): Promise<void> {
    const genre = await this.prisma.genre.findUnique({
      where: { id: d.genreId },
    });
    if (!genre) {
      throw new NotFoundException("No se ha encontrado el género");
    }
    const _d = await this.prisma.discography.create({
      data: d,
    });
    try {
      switch (d.format) {
        case Format.CD:
          await this.prisma.cd.create({ data: { discographyId: _d.id } });
          break;
        case Format.VINYL:
          if (!d.vinylSize || ![7, 10, 12].includes(d.vinylSize)) {
            throw new BadRequestException("No se ha encontrado el tamaño");
          }
          await this.prisma.vinyl.create({
            data: {
              discographyId: _d.id,
              size: d.vinylSize,
              specialEdition: d.vinylSpecialEdition,
            },
          });
          break;
        case Format.CASSETTE:
          if (!d.cassetteCondition) {
            throw new BadRequestException("No se ha encontrado la condición");
          }
          await this.prisma.cassette.create({
            data: { discographyId: _d.id, condition: d.cassetteCondition },
          });
          break;
      }
    } catch (error) {
      await this.prisma.discography.delete({ where: { id: _d.id } });
      throw error;
    }
  }

  async update(id: bigint, d: AddDiscographyDto): Promise<void> {
    const genre = await this.prisma.genre.findUnique({
      where: { id: d.genreId },
    });
    if (!genre) {
      throw new NotFoundException("No se ha encontrado el género");
    }
    const _d = await this.prisma.discography.findUnique({ where: { id } });
    if (!_d) {
      throw new NotFoundException("No se ha encontrado la discografía");
    }
    if (_d.format !== d.format) {
      await this.prisma.cd.delete({ where: { discographyId: id } });
      await this.prisma.vinyl.delete({ where: { discographyId: id } });
      await this.prisma.cassette.delete({ where: { discographyId: id } });
      switch (d.format) {
        case Format.CD:
          await this.prisma.cd.create({ data: { discographyId: id } });
          break;
        case Format.VINYL:
          if (!d.vinylSize || ![7, 10, 12].includes(d.vinylSize)) {
            throw new BadRequestException("No se ha encontrado el tamaño");
          }
          await this.prisma.vinyl.create({
            data: {
              discographyId: id,
              size: d.vinylSize,
              specialEdition: d.vinylSpecialEdition,
            },
          });
          break;
        case Format.CASSETTE:
          if (!d.cassetteCondition) {
            throw new BadRequestException("No se ha encontrado la condición");
          }
          await this.prisma.cassette.create({
            data: { discographyId: id, condition: d.cassetteCondition },
          });
          break;
      }
    } else {
      switch (d.format) {
        case Format.CD:
          await this.prisma.cd.update({
            where: { discographyId: id },
            data: { discographyId: id },
          });
          break;
        case Format.VINYL:
          await this.prisma.vinyl.update({
            where: { discographyId: id },
            data: {
              discographyId: id,
              size: d.vinylSize,
              specialEdition: d.vinylSpecialEdition,
            },
          });
          break;
        case Format.CASSETTE:
          await this.prisma.cassette.update({
            where: { discographyId: id },
            data: { discographyId: id, condition: d.cassetteCondition },
          });
          break;
      }
    }
    await this.prisma.discography.update({
      where: { id },
      data: d,
    });
  }

  async addImage(id: bigint, image: File): Promise<void> {
    const d = this.prisma.discography.findUnique({ where: { id } });
    if (!d) {
      throw new NotFoundException("No se ha encontrado la discografía");
    }
    const url = await storage.store(`fotos/discography_${id}`, image);
    this.prisma.discography.update({
      where: { id },
      data: { imageUrl: url },
    });
  }

  async delete(id: bigint) {
    const d = await this.prisma.discography.findUnique({ where: { id } });
    if (!d) {
      return;
    }
    await this.prisma.discography.update({
      where: { id },
      data: { visible: false, deletedAt: new Date() },
    });
  }

  private toDto(d: any): DiscographyDto {
    d.id = Number(d.id);
    d.price = d.price.toNumber();
    d.genreName = d.genre.name;
    delete d.genre;
    d.cassetteCondition = d.cassette?.condition;
    delete d.cassette;
    d.vinylSize = d.vinyl?.size;
    d.vinylSpecialEdition = d.vinyl?.specialEdition;
    delete d.vinyl;
    d.rating = !d.ratings?.length
      ? 0
      : d.ratings.reduce(
          (acc: number, r: { rating: number }) => acc + r.rating,
          0
        ) / d.ratings.length;
    delete d.ratings;
    return d;
  }
}

export const discographyController = new DiscographyController();
