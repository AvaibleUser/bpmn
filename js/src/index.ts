import { App } from "@/models/util/util.model";
import { routes } from "@/routes";
import { exceptionHandler } from "@/routes/middleware";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<App>()
  .use("/*", cors())
  .use(logger())
  .onError(exceptionHandler())
  .route("/api", routes);

export default {
  fetch: app.fetch,
  port: process.env.PORT || 3000,
};
