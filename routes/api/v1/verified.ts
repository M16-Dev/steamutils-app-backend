import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { db } from "../../../db/service.ts";

const verifiedRouter = new Hono<{ Variables: { guildId: string } }>()
  .use(
    "*",
    bearerAuth({
      verifyToken: (token, c) => {
        const guildId = db.guildTokens.getByToken(token);
        if (guildId) {
          c.set("guildId", guildId);
          return true;
        }
        return false;
      },
    }),
  )
  .get("/", (c) => {
    const guildId = c.get("guildId");

    const newRows = db.connections.fetchNew(guildId);

    const response = newRows.map((row) => ({
      discordId: row.discord_id,
      steamId: row.steam_id,
      createdAt: row.created_at,
    }));

    return c.json(response);
  });

export default verifiedRouter;
