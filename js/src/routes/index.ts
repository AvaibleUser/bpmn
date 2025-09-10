import { App } from "@/models/util/util.model";
import { catalogRoutes } from "@/routes/catalog";
import { commerceRoutes } from "@/routes/commerce";
import { interactivityRoutes } from "@/routes/interactivity";
import { Hono } from "hono";

export const routes = new Hono<App>()
  .route("/", catalogRoutes)
  .route("/", interactivityRoutes)
  .route("/", commerceRoutes);
