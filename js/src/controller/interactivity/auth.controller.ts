import { jwtConfig, verify } from "@/config/auth.config";
import { Authentication } from "@/models/interactivity/user.model";
import { UnauthorizedException } from "@/models/util/exception.model";
import { Jwt } from "@/models/util/util.model";
import { PrismaClient, Role } from "@prisma/client";
import { sign } from "hono/jwt";

export class AuthController {
  private prisma = new PrismaClient();

  async generateToken<T extends Role>(
    userId: bigint | number,
    ...roles: T[]
  ): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const payload: Jwt = {
      iss: "self",
      sub: `${userId}`,
      iat: now,
      exp: now + 60 * 60 * 24,
      role: roles,
    };
    return await sign(payload, jwtConfig.secret.privateKey(), jwtConfig.alg);
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<Authentication<Role>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstname: true,
        password: true,
        role: true,
        verified: true,
        banned: true,
        active: true,
      },
    });
    if (!user || !(await verify(password, user.password))) {
      throw new UnauthorizedException(
        "El email o la contraseña son incorrectos"
      );
    }
    if (!user.verified) {
      throw new UnauthorizedException(
        "El usuario no ha sido verificado por e-mail"
      );
    }
    if (user.banned || !user.active) {
      throw new UnauthorizedException(
        "El usuario se encuentra baneado o no está activo"
      );
    }
    return {
      id: user.id,
      firstname: user.firstname,
      email,
      password,
      authorities: [user.role],
    };
  }
}

export const authController = new AuthController();
