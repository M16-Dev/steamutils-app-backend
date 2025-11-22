import { Application } from "@oak/oak";
import { connectRouter } from "./routes/connect.ts";
import { codesRouter } from "./routes/codes.ts";

const app = new Application();

app.use(connectRouter.routes());
app.use(connectRouter.allowedMethods());
app.use(codesRouter.routes());
app.use(codesRouter.allowedMethods());

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
if (!portEnv) {
  console.warn("⚠️ PORT environment variable is not set. Using default port 8000.");
}
const PORT = portEnv ? parseInt(portEnv) : 8000;

console.log(`🚀 Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
