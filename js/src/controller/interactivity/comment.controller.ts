import { CommentDto } from "@/models/interactivity/comment.model";
import { NotFoundException } from "@/models/util/exception.model";
import { Pageable, PageModel } from "@/models/util/util.model";
import { PrismaClient } from "@prisma/client";

export class CommentController {
  private prisma = new PrismaClient();

  async findDeletedByAdmin(userId: bigint): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: { userId, deleted: true },
      include: { user: { select: { username: true } } },
    });
    return comments.map(this.toDto());
  }

  async findRootComments(
    discographyId: bigint,
    pageable: Pageable
  ): Promise<PageModel<CommentDto>> {
    const where = {
      discographyId,
      deletedAt: null,
      deleted: false,
      commentId: null,
    };
    const comments = await this.prisma.comment.findMany({
      where,
      include: { user: { select: { username: true } } },
      skip: pageable.page * pageable.size,
      take: pageable.size,
    });
    const totalElements = await this.prisma.comment.count({ where });

    return {
      content: comments.map(this.toDto()),
      page: {
        size: pageable.size,
        number: pageable.page,
        totalElements,
        totalPages: Math.ceil(totalElements / pageable.size),
      },
    };
  }

  async findReplyComments(
    discographyId: bigint,
    replyTo: bigint,
    pageable: Pageable
  ): Promise<PageModel<CommentDto>> {
    const where = {
      discographyId,
      deletedAt: null,
      deleted: false,
      commentId: replyTo,
    };
    const comments = await this.prisma.comment.findMany({
      where,
      include: { user: { select: { username: true } } },
      skip: pageable.page * pageable.size,
      take: pageable.size,
    });
    const totalElements = await this.prisma.comment.count({ where });

    return {
      content: comments.map(this.toDto()),
      page: {
        size: pageable.size,
        number: pageable.page,
        totalElements,
        totalPages: Math.ceil(totalElements / pageable.size),
      },
    };
  }

  async create(
    discographyId: bigint,
    userId: bigint,
    content: string,
    replyToId?: bigint
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
    if (replyToId) {
      const comment = await this.prisma.comment.findUnique({
        where: { id: replyToId },
      });
      if (!comment) {
        throw new NotFoundException("No se ha encontrado el comentario");
      }
    }

    await this.prisma.comment.create({
      data: { discographyId, userId, content, commentId: replyToId },
    });
  }

  async update(id: bigint, content: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException("No se ha encontrado el comentario");
    }
    await this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async deleteByAdmin(id: bigint): Promise<void> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return;
    }
    await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date(), deleted: true },
    });
  }

  async delete(id: bigint): Promise<void> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return;
    }
    await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date(), deleted: true },
    });
  }

  private toDto(): (value: any) => CommentDto {
    return (comment) => ({
      id: Number(comment.id),
      content: comment.content,
      userId: Number(comment.userId),
      username: comment.user.username,
      replyTo: Number(comment.commentId),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });
  }
}

export const commentController = new CommentController();
