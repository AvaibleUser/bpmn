import { encode } from "@/config/auth.config";
import { AddUserDto, UserDto } from "@/models/interactivity/user.model";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@/models/util/exception.model";
import { PrismaClient, Role } from "@prisma/client";

export class UserController {
  private prisma = new PrismaClient();
  private dto = {
    id: true,
    username: true,
    email: true,
    role: true,
    firstname: true,
    lastname: true,
    verified: true,
    active: true,
    banned: true,
    createdAt: true,
    updatedAt: true,
  };

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.dto,
    });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    return this.toDto(user);
  }

  async findAndVerify(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.dto,
    });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    return this.toDto(
      await this.prisma.user.update({
        where: { email },
        data: { verified: true },
        select: this.dto,
      })
    );
  }

  async changeRole(id: bigint, role: Role): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    await this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async changeActive(id: bigint, active: boolean): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    await this.prisma.user.update({
      where: { id },
      data: { active },
    });
  }

  async changeBanned(id: bigint, banned: boolean): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    await this.prisma.user.update({
      where: { id },
      data: { banned },
    });
  }

  async changePassword(
    email: string,
    password: string,
    verify: string
  ): Promise<UserDto> {
    if (password !== verify) {
      throw new BadRequestException("Las contraseñas no coinciden");
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("No se ha encontrado el usuario");
    }
    return this.toDto(
      await this.prisma.user.update({
        where: { email },
        data: { password: await encode(password) },
        select: this.dto,
      })
    );
  }

  async registerUser(user: AddUserDto): Promise<UserDto> {
    if (await this.prisma.user.findUnique({ where: { email: user.email } })) {
      throw new ConflictException(
        "El email que se intenta registrar ya está en uso"
      );
    }
    if (
      await this.prisma.user.findUnique({ where: { username: user.username } })
    ) {
      throw new ConflictException(
        "El nombre de usuario que se intenta registrar ya está en uso"
      );
    }
    return this.toDto(
      await this.prisma.user.create({
        data: {
          ...user,
          password: await encode(user.password),
          role: Role.CLIENT,
        },
        select: this.dto,
      })
    );
  }

  private toDto(user: any): UserDto {
    user.id = Number(user.id);
    return user;
  }
}

export const userController = new UserController();
