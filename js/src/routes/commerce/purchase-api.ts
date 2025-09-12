import { purchaseController } from "@/controller/commerce/purchase.controller";
import { addPurchase } from "@/models/commerce/purchase.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";
export const purchaseApi = new Hono<App>();

purchaseApi.get(
  "/purchases/me",
  authenticated,
  rolesAllowed("ADMIN"),
  async (c) => {
    const user = BigInt(c.get("jwtPayload").sub);
    const purchases = await purchaseController.findByUserId(user);
    return c.json(purchases);
  }
);

purchaseApi.get(
  "/purchases",
  authenticated,
  rolesAllowed("ADMIN"),
  async (c) => {
    const purchases = await purchaseController.findAll();
    return c.json(purchases);
  }
);

purchaseApi.get(
  "/purchases/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  async (c) => {
    const { id } = c.req.valid("param");
    const purchase = await purchaseController.findById(id);
    return c.json(purchase);
  }
);

purchaseApi.post(
  "/discographies/:discographyId/purchases",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  zv("json", addPurchase),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    const { quantity } = c.req.valid("json");
    await purchaseController.create(userId, discographyId, quantity);
    return c.body(null, 201);
  }
);
