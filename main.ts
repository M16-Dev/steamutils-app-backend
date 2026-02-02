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

const routes = app
  .route("/api/v1/codes", codesRouter)
  .route("/api/v1/connections", connectionsApiRouter)
  .route("/connect", connectRouter)
  .route("/connections", connectionsRouter);

export type AppType = typeof routes;

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error("Internal Server Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

Deno.serve({ port: config.port }, app.fetch);
