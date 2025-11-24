import { Application } from "@oak/oak";
import { connectRouter } from "./routes/connect.ts";
import { codesRouter } from "./routes/codes.ts";
import { connectionRouter } from "./routes/connections.ts";
import { config } from "./config.ts";
import { errorHandler } from "./middleware/error.ts";

const app = new Application();

app.use(errorHandler);

app.use(connectRouter.routes());
app.use(connectRouter.allowedMethods());
app.use(codesRouter.routes());
app.use(codesRouter.allowedMethods());
app.use(connectionRouter.routes());
app.use(connectionRouter.allowedMethods());

console.log(`🚀 Server running on ${config.appUrl}`);
await app.listen({ port: config.port });
