import { songController as controller } from "@/controller/catalog/song.controller";
import { upsertSong } from "@/models/catalog/song.model";
import { App, idParam, otherIdParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const songApi = new Hono<App>();

songApi.get(
  "/discographies/:discographyId/songs",
  zv("param", otherIdParam("discographyId")),
  async (c) => {
    const { discographyId } = c.req.valid("param");
    const songs = await controller.findByDiscography(discographyId);
    return c.json(songs);
  }
);

songApi.post(
  "/discographies/:discographyId/songs",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", otherIdParam("discographyId")),
  zv("json", upsertSong),
  async (c) => {
    const { discographyId } = c.req.valid("param");
    const song = c.req.valid("json");
    await controller.create(discographyId, song);
    return c.body(null, 201);
  }
);

songApi.put(
  "/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  zv("json", upsertSong),
  async (c) => {
    const { id } = c.req.valid("param");
    const song = c.req.valid("json");
    await controller.update(id, song);
    return c.body(null, 204);
  }
);

songApi.delete(
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
