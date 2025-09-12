import { orderController as controller } from "@/controller/commerce/order.controller";
import { statusParam, updateOrder } from "@/models/commerce/order.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const orderApi = new Hono<App>().basePath("/orders");

orderApi.get("/", authenticated, zv("query", statusParam), async (c) => {
  const userId = BigInt(c.get("jwtPayload").sub);
  const { status } = c.req.valid("query");
  const orders = await controller.findByUserId(userId, status);
  return c.json(orders);
});

orderApi.get("/:id", authenticated, zv("param", idParam), async (c) => {
  const userId = BigInt(c.get("jwtPayload").sub);
  const { id } = c.req.valid("param");
  const order = await controller.findByIdAndUserId(id, userId);
  return c.json(order);
});

orderApi.post("/", authenticated, async (c) => {
  const userId = BigInt(c.get("jwtPayload").sub);
  await controller.create(userId);
  return c.body(null, 201);
});

orderApi.put(
  "/:id/complete",
  authenticated,
  zv("param", idParam),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { id } = c.req.valid("param");
    await controller.pay(userId, id);
    return c.body(null, 204);
  }
);

orderApi.put(
  "/:id/send",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  zv("json", updateOrder),
  async (c) => {
    const { id } = c.req.valid("param");
    const order = c.req.valid("json");
    await controller.update(id, order);
    return c.body(null, 204);
  }
);

orderApi.delete("/:id", authenticated, zv("param", idParam), async (c) => {
  const userId = BigInt(c.get("jwtPayload").sub);
  const { id } = c.req.valid("param");
  await controller.delete(userId, id);
  return c.body(null, 204);
});
