import { Router } from "@oak/oak";
import { db } from "../db/service.ts";
import { z } from "zod";
import { validateBody, validateRoute } from "../middleware/validate.ts";
import { requireToken } from "../middleware/auth.ts";

import { config } from "../config.ts";

export const codesRouter = new Router({ prefix: "/codes" });
codesRouter.use(requireToken);

const CreateCodeSchema = z.object({
  guildId: z.string().regex(/^[0-9]+$/),
  ip: z.string().ip(),
  port: z.number().int().positive().max(65535),
  password: z.string().min(1).max(50).nullable(),
});

codesRouter.post("/", validateBody(CreateCodeSchema), (ctx) => {
  const { guildId, ip, port, password } = ctx.state.validatedBody;

  if (db.serverCodes.getGuildCodesCount(guildId) >= config.plans.free.maxCodesPerGuild) {
    const code = db.serverCodes.getCodeByServer(guildId, ip, port);
    if (code) {
      db.serverCodes.updatePassword(code, password);
      ctx.response.status = 200;
      ctx.response.body = { code };
      return;
    }

    ctx.throw(402, "Free codes limit reached for this guild");
  }

  const code = db.serverCodes.create(guildId, ip, port, password);

  ctx.response.status = 201;
  ctx.response.body = { code };
});

const CodeSchema = z.object({
  code: z.string().toUpperCase().regex(/^[A-Z]{8}$/),
});

codesRouter.get("/:code", validateRoute(CodeSchema), (ctx) => {
  const { code } = ctx.state.validatedRoute;

  const server = db.serverCodes.getServerByCode(code);

  if (!server) ctx.throw(404, "Code not found");

  ctx.response.status = 200;
  ctx.response.body = { data: server };
});

codesRouter.delete("/:code", validateRoute(CodeSchema), (ctx) => {
  const { code } = ctx.state.validatedRoute;

  const success = db.serverCodes.delete(code);

  if (!success) ctx.throw(404, "Code not found");

  ctx.response.status = 201;
  ctx.response.body = { code };
});

codesRouter.get("/guild/:guildId", validateRoute(z.object({ guildId: z.string().regex(/^[0-9]+$/) })), (ctx) => {
  const { guildId } = ctx.state.validatedRoute;

  const codes = db.serverCodes.getAllByGuild(guildId);

  ctx.response.status = 200;
  ctx.response.body = { data: codes };
});
