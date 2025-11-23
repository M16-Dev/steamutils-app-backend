import { Router } from "@oak/oak";
import { db } from "../db/service.ts";
import { z } from "zod";
import { validateRouteParams } from "../middleware/validate.ts";

export const connectRouter = new Router({ prefix: "/connect" });

const CodeParamSchema = z.object({
  code: z.string().toUpperCase().regex(/^[A-Z]{8}$/),
});

connectRouter.get("/:code", validateRouteParams(CodeParamSchema), (ctx) => {
  const { code } = ctx.state.routeParams;

  const server = db.serverCodes.getServerByCode(code);
  if (!server) return ctx.throw(404, "Server not found");

  ctx.response.redirect(
    `steam://connect/${server.ip}:${server.port}/${server.password ?? ""}`,
  );
});
