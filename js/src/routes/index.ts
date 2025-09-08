import { App } from "@/models/util.model";
import { Hono } from "hono";
import { discographyApi } from "./discography-api";

export const routes = new Hono<App>().route("/", discographyApi);
