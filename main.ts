import { Application } from "@oak/oak";
import { steamRouter } from "./routes/steam.ts";

const app = new Application();

app.use(steamRouter.routes());
app.use(steamRouter.allowedMethods());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);

    ctx.response.status = 500;
    ctx.response.body = {
      error: "Internal Server Error",
    };
  }
});

const portEnv = Deno.env.get("PORT");
const PORT = portEnv ? parseInt(portEnv) : 8000;

console.log(`🚀 Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
