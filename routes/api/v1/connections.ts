import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "@zod/zod";
import { db } from "../../../db/service.ts";
import { config } from "../../../config.ts";

const app = new Hono();

app.use(bearerAuth({ token: config.apiKey }));

const GetConnectionsSchema = z.object({
  discordId: z.string().regex(/^\d+$/),
});

app.get("/:discordId", zValidator("param", GetConnectionsSchema), (c) => {
  const { discordId } = c.req.valid("param");
  const connections = db.connections.getAllByDiscordId(discordId);

  return c.json({ connections }, 200);
});

const DeleteConnectionsSchema = z.object({
  discordId: z.string().regex(/^\d+$/),
  guildId: z.string().regex(/^\d+$/),
});

app.delete("/", zValidator("json", DeleteConnectionsSchema), (c) => {
  const { discordId, guildId } = c.req.valid("json");
  const success = db.connections.delete(discordId, guildId);

  if (!success) {
    return c.json({ error: "Connection not found." }, 404);
  }

  return c.body(null, 204);
});

export default app;
