import { commentController as comment } from "@/controller/interactivity/comment.controller";
import { userController as controller } from "@/controller/interactivity/user.controller";
import { changeRole } from "@/models/interactivity/user.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const userApi = new Hono<App>().basePath("/users");

userApi.patch(
  "/:id/role",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  zv("json", changeRole),
  async (c) => {
    const { id } = c.req.valid("param");
    const { role } = c.req.valid("json");
    await controller.changeRole(id, role);
    return c.body(null, 204);
  }
);

userApi.patch(
  "/:id/active",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  async (c) => {
    const { id } = c.req.valid("param");
    await controller.changeActive(id);
    return c.body(null, 204);
  }
);

userApi.patch(
  "/:id/comments/:commentId",
  authenticated,
  zv("param", idParam.and(otherIdParam("commentId"))),
  async (c) => {
    const { id, commentId } = c.req.valid("param");
    await comment.deleteByAdmin(commentId);
    if ((await comment.findDeletedByAdmin(id)).length >= 3) {
      controller.changeBanned(id, true);
    }
    return c.body(null, 204);
  }
);
