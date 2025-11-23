import { Context, Next } from "@oak/oak";
import { config } from "../config.ts";

export async function requireToken(ctx: Context, next: Next) {
  const apiKey = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

  if (apiKey !== config.apiKey) {
    ctx.throw(401, "Unauthorized: Invalid or missing API Key");
  }

  await next();
}
