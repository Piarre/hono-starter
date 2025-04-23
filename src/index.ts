import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { poweredBy } from "hono/powered-by";
import debugRoute from "~/routes/debug";
import statics from "~/routes/static";
import exportRoute from "./routes/export";

const app = new Hono();

app.use(
  "*",
  cors({
    // origin: ["localhost", "logizip.kepa.ovh"],
    origin: ["http://localhost:3000"],
  }),
);
app.use(logger());
app.use(poweredBy());
app.use(prettyJSON());

app.get("/", (c) => c.json({ message: "Hello World" }));

app.route("/export", exportRoute);
app.route("/debug", debugRoute);
app.route("/static/*", statics);

export default {
  port: 2007,
  // hostname: "0.0.0.0",
  fetch: app.fetch,
};
