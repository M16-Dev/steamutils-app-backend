import { Router } from "@oak/oak";
import { db } from "../db/service.ts";

export const steamRouter = new Router();

steamRouter.get("/connect/:code", (ctx) => {
  const code = ctx.params.code;
  if (!code.match(/^[A-Z]{8}$/)) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      error: "Invalid server code",
    };
    return;
  }

  const server = db.connectCodes.getServerByCode(code);
  if (!server) {
    ctx.response.status = 404;
    ctx.response.body = {
      success: false,
      error: "Server not found",
    };
    return;
  }

  ctx.response.redirect(
    `steam://connect/${server.ip}:${server.port}/${server.password ?? ""}`
  );
});
