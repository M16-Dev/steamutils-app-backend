import { z } from "zod";
import type { Context, Next, RouterContext } from "@oak/oak";

export function validateBody<T extends z.ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      const body = await ctx.request.body.json();
      ctx.state.validatedBody = schema.parse(body);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.response.status = 400;
        ctx.response.body = {
          success: false,
          error: "Validation failed",
          details: error.errors.map((e: z.ZodIssue) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        };
      } else {
        throw error;
      }
    }
  };
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      const params = Object.fromEntries(ctx.request.url.searchParams);
      ctx.state.validatedQuery = schema.parse(params);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.response.status = 400;
        ctx.response.body = {
          success: false,
          error: "Invalid query parameters",
          details: error.errors.map((e: z.ZodIssue) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        };
      } else {
        throw error;
      }
    }
  };
}

export function validateRoute<T extends z.ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      const params = (ctx as RouterContext<string>).params;
      ctx.state.validatedRoute = schema.parse(params);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.response.status = 400;
        ctx.response.body = {
          success: false,
          error: "Invalid route parameters",
          details: error.errors.map((e: z.ZodIssue) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        };
      } else {
        throw error;
      }
    }
  };
}
