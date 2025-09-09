import { GenreDto } from "@/models/catalog/genre.model";
import {
  ConflictException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient } from "@prisma/client";

export class GenreController {
  private prisma = new PrismaClient();

  async findAll(): Promise<GenreDto[]> {
    return (await this.prisma.genre.findMany()).map(this.toDto);
  }

  async create(name: string): Promise<void> {
    if (await this.prisma.genre.findUnique({ where: { name } })) {
      throw new ConflictException("Ya existe un género con ese nombre");
    }
    await this.prisma.genre.create({ data: { name } });
  }

  async update(id: bigint, name: string): Promise<void> {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) {
      throw new NotFoundException("No se ha encontrado el género");
    }
    if (name === genre.name) {
      return;
    }
    if (await this.prisma.genre.findUnique({ where: { name } })) {
      throw new ConflictException("Ya existe un género con ese nombre");
    }
    await this.prisma.genre.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: bigint): Promise<void> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { discographies: true },
    });
    if (!genre) {
      return;
    }
    if (genre.discographies.length > 0) {
      throw new ConflictException(
        "No se puede eliminar el género porque tiene discografías asociadas"
      );
    }
    await this.prisma.genre.delete({ where: { id } });
  }

  toDto(g: any): GenreDto {
    g.id = Number(g.id);
    return g;
  }
}

export const genreController = new GenreController();
