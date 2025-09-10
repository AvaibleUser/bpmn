import { promotionController as controller } from "@/controller/commerce/promotion.controller";
import { upsertPromotion } from "@/models/commerce/promotion.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const promotionApi = new Hono<App>();

promotionApi.get("/promotions", async (c) => {
  const promotions = controller.findAll();
  return c.json(promotions);
});

promotionApi.get("/promotions/:id", zv("param", idParam), async (c) => {
  const { id } = c.req.valid("param");
  const promotion = await controller.findById(id);
  return c.json(promotion);
});

promotionApi.get(
  "/discographies/:discographyId/promotions",
  zv("param", otherIdParam("discographyId")),
  async (c) => {
    const { discographyId } = c.req.valid("param");
    const promotions = await controller.findByCdId(discographyId);
    return c.json(promotions);
  }
);

promotionApi.post(
  "/groups/:groupId/promotions",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", otherIdParam("groupId")),
  zv("json", upsertPromotion),
  async (c) => {
    const { groupId } = c.req.valid("param");
    const promotion = c.req.valid("json");
    await controller.create(groupId, promotion);
    return c.body(null, 201);
  }
);

promotionApi.put(
  "/groups/:groupId/promotions/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam.and(otherIdParam("groupId"))),
  zv("json", upsertPromotion),
  async (c) => {
    const { groupId, id } = c.req.valid("param");
    const promotion = c.req.valid("json");
    await controller.update(id, groupId, promotion);
    return c.body(null, 204);
  }
);

promotionApi.delete(
  "/promotions/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  async (c) => {
    const { id } = c.req.valid("param");
    await controller.delete(id);
    return c.body(null, 204);
  }
);
