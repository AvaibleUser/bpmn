import { OrderDto, UpdateOrderDto } from "@/models/commerce/order.model";
import {
  ConflictException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient, Status } from "@prisma/client";

export class OrderController {
  private prisma = new PrismaClient();

  async findByIdAndUserId(id: bigint, userId: bigint): Promise<OrderDto> {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      omit: { userId: true },
    });
    if (!order) {
      throw new NotFoundException("No se ha encontrado la orden");
    }
    return this.toDto(order);
  }

  async findByUserId(userId: bigint, status?: Status): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId, status },
      omit: { userId: true },
    });
    return orders.map(this.toDto);
  }

  async create(userId: bigint): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    const prev = await this.prisma.order.findFirst({
      where: { userId, status: Status.CART },
    });
    if (prev) {
      throw new ConflictException("El usuario ya tiene un pedido en espera");
    }
    await this.prisma.order.create({
      data: { userId, status: Status.CART, total: 0 },
    });
  }

  async update(
    userId: bigint,
    orderId: bigint,
    order: UpdateOrderDto
  ): Promise<void> {
    const actualOrder = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            discography: { select: { id: true, stock: true } },
            promotion: {
              include: {
                promotedCds: {
                  include: {
                    cd: {
                      select: {
                        discography: { select: { id: true, stock: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!actualOrder) {
      throw new NotFoundException("No se ha encontrado la orden");
    }
    const statusOrder = Object.keys(Status);
    if (
      statusOrder.indexOf(order.status) !=
      statusOrder.indexOf(actualOrder.status) + 1
    ) {
      throw new ConflictException("La orden debe ser actualizada en orden");
    }
    if (order.status === Status.PAID && actualOrder.items.length === 0) {
      throw new ConflictException("La orden no puede estar vacía");
    }
    if (actualOrder.status === Status.SENT) {
      throw new ConflictException("La orden ya ha sido enviada");
    }
    const updates = [];
    if (order.status === Status.SENT) {
      const decrementStock = (d: any, i: any) => {
        if (d.stock !== null && d.stock < i.quantity) {
          throw new ConflictException("No hay stock suficiente");
        }
        if (d.stock === null) {
          return;
        }
        return this.prisma.discography.update({
          where: { id: d.id },
          data: { stock: { decrement: i.quantity } },
        });
      };
      updates.push(
        ...actualOrder.items.flatMap((i) => {
          if (i.promotion) {
            return i.promotion.promotedCds
              .map((p) => p.cd.discography)
              .map((d) => decrementStock(d, i));
          }
          return decrementStock(i.discography, i);
        })
      );
    }
    updates.push(
      this.prisma.order.update({
        where: { id: orderId },
        data: order,
      })
    );
    await this.prisma.$transaction(updates.filter((u) => !!u));
  }

  async pay(userId: bigint, orderId: bigint): Promise<void> {
    await this.update(userId, orderId, { status: Status.PAID });
  }

  async delete(userId: bigint, orderId: bigint): Promise<void> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) {
      return;
    }
    await this.prisma.order.delete({ where: { id: orderId } });
  }

  private toDto(o: any): OrderDto {
    o.id = Number(o.id);
    return o;
  }
}

export const orderController = new OrderController();
