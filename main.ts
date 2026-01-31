import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { config } from "./config.ts";

const app = new Hono();

app.use(logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error("Internal Server Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

app.get("/", (c) => c.text("Hello Hono!"));

Deno.serve({ port: config.port }, app.fetch);
