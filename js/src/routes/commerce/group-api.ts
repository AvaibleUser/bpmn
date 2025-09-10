import { groupController as controller } from "@/controller/commerce/group.controller";
import { App } from "@/models/util/util.model";
import { Hono } from "hono";

export const groupApi = new Hono<App>().basePath("/groups");

groupApi.get("/", async (c) => {
  const groups = controller.findAll();
  return c.json(groups);
});
