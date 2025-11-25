import { Router } from "@oak/oak";
import { db } from "../db/service.ts";
import { z } from "zod";
import { verify } from "djwt";
import { validateQuery } from "../middleware/validate.ts";
import { SteamAuth } from "../utils/steamAuth.ts";
import { config } from "../config.ts";

const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(config.jwtSecret),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["verify"],
);

const steamAuth = new SteamAuth(`${config.appUrl}/connections/create/callback`, config.appUrl);

export const connectionRouter = new Router({ prefix: "/connections" });

const SteamAuthParamsSchema = z.object({
  token: z.string(),
});
connectionRouter.get("/create", validateQuery(SteamAuthParamsSchema), (ctx) => {
  const { token } = ctx.state.validatedQuery;

  if (!token) ctx.throw(400, "Missing token");

  const redirectUrl = steamAuth.getRedirectUrl({ token });
  ctx.response.redirect(redirectUrl);
});

connectionRouter.get("/create/callback", async (ctx) => {
  const steamId = await steamAuth.verify(ctx.request.url);

  if (!steamId) ctx.throw(401, "Authentication failed");

  const { token } = steamAuth.getState(ctx.request.url);

  if (!token) ctx.throw(400, "Missing token");

  let payload = null;
  try {
    payload = await verify(token, key);
  } catch (_) {
    ctx.throw(401, "Token expired/invalid");
  }

  const TokenPayloadSchema = z.object({
    discordId: z.string(),
    guildId: z.string(),
  });
  const parsed = TokenPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    ctx.throw(400, "Token payload missing required fields: discordId or guildId");
  }

  const { discordId, guildId } = parsed.data!;

  const success = db.connections.create(discordId, steamId as string, guildId);

  if (!success) {
    ctx.throw(409, "Accounts already linked.");
  }

  ctx.response.status = 200;
  ctx.response.body = { message: "Successfully linked!" };
});
