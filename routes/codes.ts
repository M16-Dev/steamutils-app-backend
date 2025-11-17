import { Router } from "@oak/oak";
import { db } from "../db/service.ts";
import { z } from "zod";
import { validate, validateRouteParams } from "../middleware/validate.ts";

export const codesRouter = new Router({ prefix: "/codes" });

const CreateCodeSchema = z.object({
  ip: z.string().ip(),
  port: z.number().int().positive().max(65535),
  password: z.string().min(1).max(50).optional(),
});

codesRouter.post("/", validate(CreateCodeSchema), (ctx) => {
  const { ip, port, password } = ctx.state.validated;

  const code = db.connectCodes.create(ip, port, password);

  ctx.response.status = 201;
  ctx.response.body = {
    success: true,
    data: { code },
  };
});

const CodeSchema = z.object({
  code: z.string().toUpperCase().regex(/^[A-Z]{8}$/),
});

codesRouter.get("/:code", validateRouteParams(CodeSchema), (ctx) => {
  const { code } = ctx.state.routeParams;

  const server = db.connectCodes.getServerByCode(code);
  if (!server) {
    ctx.response.status = 404;
    ctx.response.body = {
      success: false,
      error: "Code not found",
    };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    data: server,
  };
});


codesRouter.delete("/:code", validateRouteParams(CodeSchema), (ctx) => {
  const { code } = ctx.state.routeParams;

  const success = db.connectCodes.delete(code);

  if (!success) {
    ctx.response.status = 404;
    ctx.response.body = {
      success: false,
      error: "Code not found",
    };
    return;
  }

  ctx.response.status = 201;
  ctx.response.body = {
    success: true,
    data: { code },
  };
});
