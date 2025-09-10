import { itemController as controller } from "@/controller/commerce/item.controller";
import { upsertItem } from "@/models/commerce/item.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const itemApi = new Hono<App>().basePath("/orders/:orderId/items");

itemApi.get(
  "/",
  authenticated,
  zv("query", otherIdParam("orderId")),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { orderId } = c.req.valid("query");
    const items = await controller.findByOrderId(userId, orderId);
    return c.json(items);
  }
);

itemApi.get(
  "/:id",
  authenticated,
  zv("param", idParam.and(otherIdParam("orderId"))),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { orderId, id } = c.req.valid("param");
    const item = await controller.findById(userId, orderId, id);
    return c.json(item);
  }
);

itemApi.post(
  "/discographies/:discographyId",
  authenticated,
  zv("param", otherIdParam("orderId").and(otherIdParam("discographyId"))),
  zv("json", upsertItem),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { orderId, discographyId } = c.req.valid("param");
    const { quantity } = c.req.valid("json");
    await controller.create(userId, orderId, quantity, discographyId);
    return c.body(null, 201);
  }
);

itemApi.post(
  "/promotions/:promotionId",
  authenticated,
  zv("param", otherIdParam("orderId").and(otherIdParam("promotionId"))),
  zv("json", upsertItem),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { orderId, promotionId } = c.req.valid("param");
    const { quantity } = c.req.valid("json");
    await controller.create(userId, orderId, quantity, undefined, promotionId);
    return c.body(null, 201);
  }
);

itemApi.delete(
  "/:id",
  authenticated,
  zv("param", idParam.and(otherIdParam("orderId"))),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { orderId, id } = c.req.valid("param");
    await controller.delete(userId, orderId, id);
    return c.body(null, 204);
  }
);
