import { Router } from "@oak/oak";
import { db } from "../db/service.ts";
import { z } from "zod";
import { validateRoute } from "../middleware/validate.ts";
import { htmlErrorHandler } from "../middleware/htmlError.ts";
import { renderHtmlPage } from "../utils/templates.ts";

export const connectRouter = new Router({ prefix: "/connect" });

const CodeParamSchema = z.object({
  code: z.string().toUpperCase().regex(/^[A-Z]{8}$/),
});

connectRouter.get("/:code", validateRoute(CodeParamSchema), htmlErrorHandler, (ctx) => {
  const { code } = ctx.state.validatedRoute;

  const server = db.serverCodes.getServerByCode(code);
  if (!server) return ctx.throw(404, "Server not found");

  const steamUrl = `steam://connect/${server.ip}:${server.port}/${server.password ?? ""}`;

  ctx.response.status = 200;
  ctx.response.type = "html";
  ctx.response.body = renderHtmlPage(
    "Connecting...",
    `You are being redirected to the game server.<br><br><a href="${steamUrl}" style="color: #22c55e; text-decoration: underline;">Click here if nothing happens</a>`,
    false,
    steamUrl,
  );
});
