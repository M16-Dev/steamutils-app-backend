import { Application } from "@oak/oak";
import { connectRouter } from "./routes/connect.ts";
import { codesRouter } from "./routes/codes.ts";
import { config } from "./config.ts";

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

console.log(`🚀 Server running on ${config.appUrl}`);
await app.listen({ port: config.port });
