import {
  BadRequestException,
  UnauthorizedException,
} from "@/models/util/exception.model";
import { App } from "@/models/util/util.model";
import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";
import { ErrorHandler, MiddlewareHandler, ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import { ZodType } from "zod";
import { jwtConfig } from "@/config/auth.config";

export const authenticated: MiddlewareHandler<App> = jwt({
  secret: jwtConfig.secret.publicKey(),
  alg: jwtConfig.alg,
});

export function rolesAllowed(...roles: Role[]): MiddlewareHandler<App> {
  return async (c, next) => {
    const payload = c.get("jwtPayload");
    if (payload.role.some((role) => roles.includes(role))) {
      return await next();
    }
    throw new UnauthorizedException("No tiene los permisos suficientes");
  };
}

export function exceptionHandler(): ErrorHandler<App> {
  return (err, c) => {
    console.error(err);
    let status = err instanceof HTTPException ? err.status : 500;
    const response: any = {
      message: err.message,
      timestamp: Date.now(),
    };
    if (err instanceof BadRequestException) {
      response["errors"] = err.errors;
    }
    return c.json(response, status);
  };
}

export const zv = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, (result, _) => {
    if (!result.success) {
      throw new BadRequestException(
        "Los campos no son válidos",
        JSON.parse(result.error.message)
      );
    }
  });
