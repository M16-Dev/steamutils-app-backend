import base from "./config.json" with { type: "json" };
import { z } from "zod";

export const rawConfig = {
  ...base,
  port: Number(Deno.env.get("PORT")) ?? 8000,
  apiKey: Deno.env.get("API_KEY") as string | undefined,
  appUrl: Deno.env.get("APP_URL") as string | undefined,
  jwtSecret: Deno.env.get("JWT_SECRET") as string | undefined,
};

if (!rawConfig.plans.free) {
  rawConfig.plans.free = { maxCodesPerGuild: 1 };
}

const PlanSchema = z.object({
  maxCodesPerGuild: z.number().int().positive(),
});

const ConfigSchema = z.object({
  port: z.number().int().positive().max(65535),
  apiKey: z.string(),
  appUrl: z.string().url().regex(/^https?:\/\/.+/),
  jwtSecret: z.string(),
  plans: z.record(PlanSchema),
});

const parsed = ConfigSchema.safeParse(rawConfig);
if (!parsed.success) {
  console.error("❌ CRITICAL ERROR: Invalid or missing configuration:");
  console.error(parsed.error.format());
  Deno.exit(1);
}

export const config = parsed.data;

export default config;
