import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { prettyJSON } from "hono/pretty-json";
import debugRoute from "./routes/debug";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger());
app.use(poweredBy());
app.use(prettyJSON());

app.get("/", (c) => c.json({ message: "Hello World" }));

app.route("/debug", debugRoute);

export default app;
