import { discographyController as controller } from "@/controller/catalog/discography.controller";
import {
  addDiscography,
  filterDiscography,
} from "@/models/catalog/discography.model";
import { App, idParam, image, otherIdParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const discographyApi = new Hono<App>().basePath("/discographies");

discographyApi.get("/", zv("query", filterDiscography), async (c) => {
  const filter = c.req.valid("query");
  const page = await controller.findAll(filter);
  return c.json(page, 200);
});

discographyApi.get(
  "/promotions/:promotionId",
  zv("param", otherIdParam("promotionId")),
  async (c) => {
    const { promotionId } = c.req.valid("param");
    const discographies = await controller.findByPromotionId(promotionId);
    return c.json(discographies, 200);
  }
);

discographyApi.get("/:id", zv("param", idParam), async (c) => {
  const { id } = c.req.valid("param");
  const discography = await controller.findById(id);
  return c.json(discography, 200);
});

discographyApi.post(
  "/",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("json", addDiscography),
  async (c) => {
    const discography = c.req.valid("json");
    const id = await controller.create(discography);
    return c.json({ id }, 201);
  }
);

discographyApi.put(
  "/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  zv("json", addDiscography),
  async (c) => {
    const { id } = c.req.valid("param");
    const discography = c.req.valid("json");
    await controller.update(id, discography);
    return c.body(null, 204);
  }
);

discographyApi.patch(
  "/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  zv("form", image),
  async (c) => {
    const { id } = c.req.valid("param");
    const { image } = c.req.valid("form");
    await controller.addImage(id, image);
    return c.body(null, 204);
  }
);

discographyApi.delete(
  "/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  async (c) => {
    const { id } = c.req.valid("param");
    await controller.delete(id);
    return c.body(null, 204);
  }
);
