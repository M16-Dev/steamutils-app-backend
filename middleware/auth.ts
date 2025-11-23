import { Context, Next } from "@oak/oak";
import { config } from "../config.ts";

export async function requireToken(ctx: Context, next: Next) {
  const apiKey = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

  if (apiKey !== config.apiKey) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Invalid or missing API Key" };
    return;
  }

  await next();
}
