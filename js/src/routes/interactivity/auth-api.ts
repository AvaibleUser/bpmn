import { authController as auth } from "@/controller/interactivity/auth.controller";
import { codesController as codes } from "@/controller/interactivity/codes.controller";
import { userController as controller } from "@/controller/interactivity/user.controller";
import {
  addUserDto,
  authDto,
  confirmDto,
  recoverDto,
  resetDto,
  Token,
} from "@/models/interactivity/user.model";
import {
  ConflictException,
  UnauthorizedException,
} from "@/models/util/exception.model";
import { App } from "@/models/util/util.model";
import { zv } from "@/routes/middleware";
import { Confirmation } from "@/templates/confirmation";
import { Recovery } from "@/templates/recovery";
import { Hono } from "hono";
import { raw } from "hono/html";
import { Resend } from "resend";

export const authApi = new Hono<App>().basePath("/auth");

const { emails } = new Resend();

authApi.post("/sign-up", zv("json", addUserDto), async (c) => {
  const user = c.req.valid("json");
  const savedUser = await controller.registerUser(user);
  const code = await codes.generateCode(savedUser.id);
  const { error } = await emails.send({
    from: "BPMN",
    to: user.email,
    subject: "Confirmación de usuario en BPMN",
    html: raw(Confirmation({ firstname: user.firstname, code })),
  });
  if (error) {
    throw new ConflictException(`No se pudo enviar el correo: ${error}`);
  }
  return c.body(null, 201);
});

authApi.put("/sign-up", zv("json", confirmDto), async (c) => {
  const { email, code } = c.req.valid("json");
  const confirmed = await codes.confirmCode(email, code);
  if (!confirmed) {
    throw new UnauthorizedException("No se pudo confirmar el código");
  }
  const user = await controller.findAndVerify(email);
  const token = await auth.generateToken(user.id, user.role);
  return c.json({ ...user, token } as Token, 200);
});

authApi.post("/sign-in", zv("json", authDto), async (c) => {
  const { email, password } = c.req.valid("json");
  const user = await auth.authenticate(email, password);
  const code = await codes.generateCode(user.id);
  const { error } = await emails.send({
    from: "BPMN",
    to: user.email,
    subject: "Confirmación de usuario en BPMN",
    html: raw(Confirmation({ firstname: user.firstname, code })),
  });
  if (error) {
    throw new ConflictException(`No se pudo enviar el correo: ${error}`);
  }
  return c.body(null, 201);
});

authApi.put("/sign-in/2fa", zv("json", confirmDto), async (c) => {
  const { email, code } = c.req.valid("json");
  const confirmed = await codes.confirmCode(email, code);
  if (!confirmed) {
    throw new UnauthorizedException("No se pudo confirmar el código");
  }
  const user = await controller.findAndVerify(email);
  const token = await auth.generateToken(user.id, user.role);
  return c.json({ ...user, token } as Token, 200);
});

authApi.post("/password/recovery", zv("json", recoverDto), async (c) => {
  const { email } = c.req.valid("json");
  const user = await controller.findByEmail(email);
  const code = await codes.generateCode(user.id);
  const { error } = await emails.send({
    from: "BPMN",
    to: user.email,
    subject: "Recuperación de contraseña en BPMN",
    html: raw(Recovery({ firstname: user.firstname, code })),
  });
  if (error) {
    throw new ConflictException(`No se pudo enviar el correo: ${error}`);
  }
  return c.body(null, 201);
});

authApi.put("/password/recovery", zv("json", resetDto), async (c) => {
  const { email, code, password, newPassword } = c.req.valid("json");
  const confirmed = await codes.confirmCode(email, code);
  if (!confirmed) {
    throw new UnauthorizedException("No se pudo confirmar el código");
  }
  const user = await controller.changePassword(email, password, newPassword);
  const token = await auth.generateToken(user.id, user.role);
  return c.json({ ...user, token } as Token, 200);
});
