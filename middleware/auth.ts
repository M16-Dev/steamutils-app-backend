import { Context, Next } from "@oak/oak";

const API_KEY = Deno.env.get("API_KEY");

if (!API_KEY) {
  console.warn("⚠️ API_KEY is not set! Authentication will fail.");
}

export async function requireToken(ctx: Context, next: Next) {
  const apiKey = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

  if (apiKey !== API_KEY) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Invalid or missing API Key" };
    return;
  }

  await next();
}
