import { genreController as controller } from "@/controller/catalog/genre.controller";
import { upsertGenre } from "@/models/catalog/genre.model";
import { App, idParam } from "@/models/util/util.model";
import { authenticated, rolesAllowed, zv } from "@/routes/middleware";
import { Hono } from "hono";

export const genreApi = new Hono<App>().basePath("/genres");

genreApi.get("/", async (c) => {
  const genres = await controller.findAll();
  return c.json(genres);
});

genreApi.post(
  "/",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("json", upsertGenre),
  async (c) => {
    const { name } = c.req.valid("json");
    await controller.create(name);
    return c.body(null, 201);
  }
);

genreApi.put(
  "/:id",
  authenticated,
  rolesAllowed("ADMIN"),
  zv("param", idParam),
  zv("json", upsertGenre),
  async (c) => {
    const { id } = c.req.valid("param");
    const { name } = c.req.valid("json");
    await controller.update(id, name);
    return c.body(null, 204);
  }
);

genreApi.delete(
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
