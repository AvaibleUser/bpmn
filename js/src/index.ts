import { App } from "@/models/util.model";
import { exceptionHandler } from "@/routes/middleware";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<App>()
  .use(logger())
  .onError(exceptionHandler())
  .use(
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

export default {
  fetch: app.fetch,
  port: process.env.PORT || 3000,
};
