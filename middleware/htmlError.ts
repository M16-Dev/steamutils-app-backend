import { Context, Next } from "@oak/oak";
import { renderHtmlPage } from "../utils/templates.ts";

export const htmlErrorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
    // deno-lint-ignore no-explicit-any
  } catch (err: any) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";

    ctx.response.status = err.status ?? 400;
    ctx.response.type = "html";
    ctx.response.body = renderHtmlPage("Error", message, true);
  }
};
