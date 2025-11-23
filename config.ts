import base from "./config.json" with { type: "json" };

export const config = {
  ...base,
  port: Number(Deno.env.get("PORT")) ?? 8000,
  apiKey: Deno.env.get("API_KEY"),
};

const requiredConfig = [
  { key: "apiKey", env: "API_KEY" },
];

const missing = requiredConfig.filter((item) => !config[item.key as keyof typeof config]);

if (missing.length > 0) {
  console.error("❌ CRITICAL ERROR: Missing required configuration:");
  missing.forEach(({ env }) => console.error(`   - ${env}`));
  Deno.exit(1);
}
