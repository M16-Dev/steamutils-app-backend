import { Router } from "@oak/oak";
import { db } from "../db/service.ts";
import { z } from "zod";
import { validate, validateRouteParams } from "../middleware/validate.ts";
import { requireToken } from "../middleware/auth.ts";

import { config } from "../config.ts";

export const codesRouter = new Router({ prefix: "/codes" });
codesRouter.use(requireToken);

const CreateCodeSchema = z.object({
  guildId: z.string(),
  ip: z.string().ip(),
  port: z.number().int().positive().max(65535),
  password: z.string().min(1).max(50).optional(),
});

codesRouter.post("/", validate(CreateCodeSchema), (ctx) => {
  const { guildId, ip, port, password } = ctx.state.validated;

  if (db.serverCodes.getGuildCodesCount(guildId) >= config.plans.free.maxCodesPerGuild) {
    const code = db.serverCodes.getCodeByServer(guildId, ip, port);
    if (code) {
      db.serverCodes.updatePassword(code, password);
      ctx.response.status = 200;
      ctx.response.body = { code };
      return;
    }

    ctx.response.status = 402;
    ctx.response.body = { error: "Free codes limit reached for this guild" };
    return;
  }

  const code = db.serverCodes.create(guildId, ip, port, password);

  ctx.response.status = 201;
  ctx.response.body = { code };
});

const CodeSchema = z.object({
  code: z.string().toUpperCase().regex(/^[A-Z]{8}$/),
});

codesRouter.get("/:code", validateRouteParams(CodeSchema), (ctx) => {
  const { code } = ctx.state.routeParams;

  const server = db.serverCodes.getServerByCode(code);
  if (!server) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Code not found" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = { data: server };
});

codesRouter.delete("/:code", validateRouteParams(CodeSchema), (ctx) => {
  const { code } = ctx.state.routeParams;

  const success = db.serverCodes.delete(code);

  if (!success) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Code not found" };
    return;
  }

  ctx.response.status = 201;
  ctx.response.body = { code };
});
