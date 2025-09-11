import { FilterDiscography } from "@/models/catalog/discography.model";
import { Prisma } from "@prisma/client";

type Field<K extends keyof FilterDiscography> = FilterDiscography[K];
type WhereField<K extends keyof Prisma.DiscographyWhereInput> = Pick<
  Prisma.DiscographyWhereInput,
  "AND" | "OR" | "NOT" | K
>;

export class DiscographySpecification {
  byTitleWith(title?: Field<"title">): WhereField<"title"> {
    if (!title) return {};
    return {
      title: { contains: title, mode: "insensitive" },
    };
  }

  byTitleRaw(title?: Field<"title">): Prisma.Sql | undefined {
    if (!title) return;
    return Prisma.sql`d.title LIKE '%' || ${title} || '%'`;
  }

  byArtistWith(artist?: Field<"artist">): WhereField<"artist"> {
    if (!artist) return {};
    return {
      artist: { contains: artist, mode: "insensitive" },
    };
  }

  byArtistRaw(artist?: Field<"artist">): Prisma.Sql | undefined {
    if (!artist) return;
    return Prisma.sql`d.artist LIKE '%' || ${artist} || '%'`;
  }

  byGenreWithId(genreId?: Field<"genreId">): WhereField<"genreId"> {
    if (!genreId) return {};
    return { genreId };
  }

  byGenreRaw(genreId?: Field<"genreId">): Prisma.Sql | undefined {
    if (!genreId) return;
    return Prisma.sql`d.genre_id = ${genreId}`;
  }

  byYear(year?: Field<"year">): WhereField<"year"> {
    if (!year) return {};
    return { year };
  }

  byYearRaw(year?: Field<"year">): Prisma.Sql | undefined {
    if (!year) return;
    return Prisma.sql`d.year = ${year}`;
  }

  byPriceGreaterThan(price?: Field<"priceMin">): WhereField<"price"> {
    if (!price) return {};
    return {
      price: { gt: price },
    };
  }

  byPriceGreaterThanRaw(price?: Field<"priceMin">): Prisma.Sql | undefined {
    if (!price) return;
    return Prisma.sql`d.price > ${price}`;
  }

  byPriceLessThan(price?: Field<"priceMax">): WhereField<"price"> {
    if (!price) return {};
    return {
      price: { lt: price },
    };
  }

  byPriceLessThanRaw(price?: Field<"priceMax">): Prisma.Sql | undefined {
    if (!price) return;
    return Prisma.sql`d.price < ${price}`;
  }

  byStock(stock?: Field<"stock">): WhereField<"stock"> {
    if (!stock) return {};
    return {
      AND: [
        { OR: [{ release: null }, { release: { lt: new Date() } }] },
        { OR: [{ stock: { gte: stock } }, { stock: null }] },
      ],
    };
  }

  byStockRaw(stock?: Field<"stock">): Prisma.Sql | undefined {
    if (!stock) return;
    return Prisma.sql`(d.release IS NULL OR d.release < now()) AND (d.stock >= ${stock} OR d.stock IS NULL)`;
  }

  byFormat(format?: Field<"format">): WhereField<"format"> {
    if (!format) return {};
    return { format: format as Prisma.EnumFormatFilter };
  }

  byFormatRaw(format?: Field<"format">): Prisma.Sql | undefined {
    if (!format) return;
    return Prisma.sql`d.format = ${format}::catalog.FORMAT_TYPE`;
  }

  byVisible(): WhereField<"visible"> {
    return { visible: true };
  }

  byVisibleRaw(): Prisma.Sql {
    return Prisma.sql`d.visible = true`;
  }

  byNonDeleted(): WhereField<"deletedAt"> {
    return { deletedAt: null };
  }

  byNonDeletedRaw(): Prisma.Sql {
    return Prisma.sql`d.deleted_at IS NULL`;
  }
}
