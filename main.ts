import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { config } from "./config.ts";

import codesRouter from "./routes/api/v1/codes.ts";
import connectionsApiRouter from "./routes/api/v1/connections.ts";
import connectRouter from "./routes/connect.ts";
import connectionsRouter from "./routes/connections.ts";

const app = new Hono();

app.use(logger());

app.route("/api/v1/codes", codesRouter);
app.route("/api/v1/connections", connectionsApiRouter);
app.route("/connect", connectRouter);
app.route("/connections", connectionsRouter);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error("Internal Server Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

Deno.serve({ port: config.port }, app.fetch);
