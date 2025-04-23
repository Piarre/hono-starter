import { Hono } from "hono";
import DB from "~/lib/db";
import { uptime } from "~/lib/utils";
import { statSync } from "node:fs";
import { docker } from "./export";
import Dockerode = require("dockerode");

const debugRoute = new Hono();

debugRoute.get("/uptime", (c) => c.json(uptime()));

debugRoute.all("/healthcheck", (c) => {
  const dbHealth = DB.query("SELECT 1").all();

  return dbHealth.length > 0 ? c.json({ status: "ok" }) : c.json({ status: "error" }, 500);
});

export default debugRoute;
