import { wishlistController as controller } from "@/controller/commerce/wishlist.controller";
import { paidParam, upsertWishlist } from "@/models/commerce/wishlist.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const wishlistApi = new Hono<App>();

wishlistApi.get(
  "/wishlists",
  authenticated,
  zv("query", paidParam),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { paid } = c.req.valid("query");
    const wishlists = await controller.findByUserId(userId, paid);
    return c.json(wishlists);
  }
);

wishlistApi.get(
  "/discographies/:discographyId/wishlists",
  zv("param", otherIdParam("discographyId")),
  async (c) => {
    const { discographyId } = c.req.valid("param");
    const wishlists = await controller.findByDiscographyId(discographyId);
    return c.json(wishlists);
  }
);

wishlistApi.get("/wishlists/:id", zv("param", idParam), async (c) => {
  const { id } = c.req.valid("param");
  const wishlist = await controller.findById(id);
  return c.json(wishlist);
});

wishlistApi.post(
  "/discographies/:discographyId/wishlists",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  zv("json", upsertWishlist),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    const { paid } = c.req.valid("json");
    await controller.create(userId, discographyId, paid);
    return c.body(null, 201);
  }
);

wishlistApi.put(
  "/discographies/:discographyId/wishlists",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  zv("json", upsertWishlist),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    const { paid } = c.req.valid("json");
    await controller.update(userId, discographyId, paid);
    return c.body(null, 204);
  }
);

wishlistApi.delete(
  "/discographies/:discographyId/wishlists",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    await controller.delete(userId, discographyId);
    return c.body(null, 204);
  }
);
