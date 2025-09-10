import { App } from "@/models/util/util.model";
import { discographyApi } from "@/routes/catalog/discography-api";
import { genreApi } from "@/routes/catalog/genre-api";
import { songApi } from "@/routes/catalog/song-api";
import { Hono } from "hono";

export const catalogRoutes = new Hono<App>()
  .route("/", discographyApi)
  .route("/", genreApi)
  .route("/", songApi);
