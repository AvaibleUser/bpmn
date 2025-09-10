import { App } from "@/models/util/util.model";
import { groupApi } from "@/routes/commerce/group-api";
import { itemApi } from "@/routes/commerce/item-api";
import { orderApi } from "@/routes/commerce/order-api";
import { promotionApi } from "@/routes/commerce/promotion-api";
import { purchaseApi } from "@/routes/commerce/purchase-api";
import { wishlistApi } from "@/routes/commerce/wishlist-api";
import { Hono } from "hono";

export const commerceRoutes = new Hono<App>()
  .route("/", groupApi)
  .route("/", wishlistApi)
  .route("/", promotionApi)
  .route("/", orderApi)
  .route("/", itemApi)
  .route("/", purchaseApi);
