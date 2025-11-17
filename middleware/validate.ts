import { z } from "zod";
import type { Context, Next } from "@oak/oak";

export function validate<T extends z.ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      const body = await ctx.request.body.json();
      ctx.state.validated = schema.parse(body);
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
      ctx.state.query = schema.parse(params);
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

export function validateRouteParams<T extends z.ZodType>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      // deno-lint-ignore no-explicit-any
      const params = (ctx as any).params ?? {};
      ctx.state.routeParams = schema.parse(params);
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
