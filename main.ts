import { config } from "./config.ts";
import app from "./app.ts";

Deno.serve({ port: config.port }, app.fetch);
