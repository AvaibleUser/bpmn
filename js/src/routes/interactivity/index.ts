import { App } from "@/models/util/util.model";
import { authApi } from "@/routes/interactivity/auth-api";
import { commentApi } from "@/routes/interactivity/comment-api";
import { ratingApi } from "@/routes/interactivity/rating-api";
import { userApi } from "@/routes/interactivity/user-api";
import { Hono } from "hono";

export const interactivityRoutes = new Hono<App>()
  .route("/", authApi)
  .route("/", commentApi)
  .route("/", ratingApi)
  .route("/", userApi);
