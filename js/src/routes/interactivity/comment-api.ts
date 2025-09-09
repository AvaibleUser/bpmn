import { commentController as controller } from "@/controller/interactivity/comment.controller";
import { upsertComment } from "@/models/interactivity/comment.model";
import { App, idParam, otherIdParam, pageable } from "@/models/util/util.model";
import { authenticated, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const commentApi = new Hono<App>().basePath(
  "/discographies/:discographyId/comments"
);

commentApi.get(
  "/",
  zv("param", otherIdParam("discographyId")),
  zv("query", pageable),
  async (c) => {
    const { discographyId } = c.req.valid("param");
    const pageable = c.req.valid("query");
    const comments = await controller.findRootComments(discographyId, pageable);
    return c.json(comments);
  }
);

commentApi.get(
  "/:id",
  zv("param", idParam.and(otherIdParam("discographyId"))),
  zv("query", pageable),
  async (c) => {
    const { discographyId, id: replyToId } = c.req.valid("param");
    const pageable = c.req.valid("query");
    const replies = await controller.findReplyComments(
      discographyId,
      replyToId,
      pageable
    );
    return c.json(replies);
  }
);

commentApi.post(
  "/",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  zv("json", upsertComment),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    const { content } = c.req.valid("json");
    await controller.create(discographyId, userId, content);
    return c.body(null, 201);
  }
);

commentApi.post(
  "/:id",
  authenticated,
  zv("param", idParam.and(otherIdParam("discographyId"))),
  zv("json", upsertComment),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId, id: replyToId } = c.req.valid("param");
    const { content } = c.req.valid("json");
    await controller.create(discographyId, userId, content, replyToId);
    return c.body(null, 201);
  }
);

commentApi.put(
  "/:id",
  authenticated,
  zv("param", idParam),
  zv("json", upsertComment),
  async (c) => {
    const { id } = c.req.valid("param");
    const { content } = c.req.valid("json");
    await controller.update(id, content);
    return c.body(null, 204);
  }
);

commentApi.delete("/:id", authenticated, zv("param", idParam), async (c) => {
  const { id } = c.req.valid("param");
  await controller.delete(id);
  return c.body(null, 204);
});
