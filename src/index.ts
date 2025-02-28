import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { poweredBy } from "hono/powered-by";
import debugRoute from "~/routes/debug";

const app = new Hono();

app.use(logger());
app.use(
  "*",
  cors({
    origin: "*",
  }),
);
app.use(poweredBy());
app.use(prettyJSON());

app.get("/", (c) => c.json({ message: "Hello World" }));

app.route("/debug", debugRoute);

export default {
  port: 2025,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
