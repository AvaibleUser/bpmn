import { getPayload } from "@/config/auth.config";
import { ratingController as controller } from "@/controller/interactivity/rating.controller";
import { upsertRating } from "@/models/interactivity/rating.model";
import { App, otherIdParam } from "@/models/util/util.model";
import { authenticated, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const ratingApi = new Hono<App>().basePath(
  "/discographies/:discographyId/ratings"
);

ratingApi.get("/", zv("param", otherIdParam("discographyId")), async (c) => {
  const token = c.req.header("Authorization");
  const userId = token ? BigInt((await getPayload(token)).sub) : BigInt(0);
  const { discographyId } = c.req.valid("param");
  const ratings = await controller.findStats(userId, discographyId);
  return c.json(ratings);
});

ratingApi.post(
  "/",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  zv("json", upsertRating),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    const { rating } = c.req.valid("json");
    await controller.create(userId, discographyId, rating);
    return c.body(null, 201);
  }
);

ratingApi.put(
  "/",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  zv("json", upsertRating),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    const { rating } = c.req.valid("json");
    await controller.update(userId, discographyId, rating);
    return c.body(null, 204);
  }
);

ratingApi.delete(
  "/",
  authenticated,
  zv("param", otherIdParam("discographyId")),
  async (c) => {
    const userId = BigInt(c.get("jwtPayload").sub);
    const { discographyId } = c.req.valid("param");
    await controller.delete(userId, discographyId);
    return c.body(null, 204);
  }
);
