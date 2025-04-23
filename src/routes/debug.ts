import { Hono } from "hono";
import { uptime } from "~/lib/utils";

const debugRoute = new Hono();

debugRoute.get("/uptime", (c) => c.json(uptime()));

debugRoute.all("/healthcheck", (c) => c.json({ status: "ok", uptime: uptime() }));

export default debugRoute;
