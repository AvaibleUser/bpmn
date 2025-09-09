import { SongDto, UpsertSongDto } from "@/models/catalog/song.model";
import {
  BadRequestException,
  NotFoundException,
} from "@/models/util/exception.model";
import { Format, PrismaClient } from "@prisma/client";

export class SongController {
  private prisma = new PrismaClient();

  async findByDiscography(id: bigint): Promise<SongDto[]> {
    return (
      await this.prisma.song.findMany({ where: { discographyId: id } })
    ).map(this.toDto);
  }

  async create(discographyId: bigint, s: UpsertSongDto): Promise<void> {
    const discography = await this.prisma.discography.findUnique({
      where: { id: discographyId },
    });
    if (!discography) {
      throw new NotFoundException("No se ha encontrado la discografía");
    }
    if (discography.format !== Format.CASSETTE && !s.side) {
      throw new BadRequestException("La canción debe tener un lado específico");
    }
    await this.prisma.song.create({ data: { ...s, discographyId } });
  }

  async update(id: bigint, s: UpsertSongDto): Promise<void> {
    const song = await this.prisma.song.findUnique({ where: { id } });
    if (!song) {
      throw new NotFoundException("No se ha encontrado la canción");
    }
    await this.prisma.song.update({ where: { id }, data: s });
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.song.delete({ where: { id } });
  }

  private toDto(s: any): SongDto {
    s.id = Number(s.id);
    s.discographyId = Number(s.discographyId);
    return s;
  }
}

export const songController = new SongController();
