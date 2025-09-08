import { App } from "@/models/util/util.model";
import { Hono } from "hono";
import { discographyApi } from "./catalog/discography-api";

export const routes = new Hono<App>().route("/", discographyApi);
