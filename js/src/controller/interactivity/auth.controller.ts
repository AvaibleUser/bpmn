import { jwtConfig, verify } from "@/config/auth.config";
import { Authentication } from "@/models/interactivity/user.model";
import { Jwt } from "@/models/util/util.model";
import { PrismaClient, Role } from "@prisma/client";
import { sign } from "hono/jwt";

export class AuthController {
  private prisma = new PrismaClient();

  async generateToken<T extends Role>(
    userId: bigint | number,
    ...roles: T[]
  ): Promise<string> {
    const now = Date.now();
    const payload: Jwt = {
      iss: "self",
      sub: `${userId}`,
      iat: now,
      exp: now + 1000 * 60 * 60 * 24,
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
        firstname: true,
        password: true,
        role: true,
        verified: true,
        banned: true,
        active: true,
      },
    });
    if (!user || !(await verify(password, user.password))) {
      throw new Error("El email o la contraseña son incorrectos");
    }
    if (!user.verified) {
      throw new Error("El usuario no ha sido verificado por e-mail");
    }
    if (user.banned || !user.active) {
      throw new Error("El usuario se encuentra baneado o no está activo");
    }
    return {
      firstname: user.firstname,
      email,
      password,
      authorities: [user.role],
    };
  }
}

export const authController = new AuthController();
