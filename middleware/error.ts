import { Context, isHttpError, Next } from "@oak/oak";

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    let status = 500;
    let message = "Internal Server Error";

    if (isHttpError(err)) {
      status = err.status;

      if (err.message && status < 500) {
        message = err.message;
      }
    }

    ctx.response.status = status;
    ctx.response.body = { error: message };

    if (status >= 500) {
      console.error(err);
    }
  }
};
