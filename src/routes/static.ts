import { Hono } from "hono";
import { serveStatic } from "hono/bun";

export default new Hono().get(
  "/",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/static/, "/static"),
  }),
);
