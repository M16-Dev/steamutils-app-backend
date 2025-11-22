import { testing } from "@oak/oak";
import { assertEquals } from "@std/assert";
import { spy } from "@std/testing/mock";

const TEST_API_KEY = "test-key";
Deno.env.set("API_KEY", TEST_API_KEY);

const { requireToken } = await import("./auth.ts");

Deno.test("requireToken - allows request with valid key", async () => {
  const ctx = testing.createMockContext({
    headers: [["Authorization", `Bearer ${TEST_API_KEY}`]],
  });
  const next = spy(testing.createMockNext());

  await requireToken(ctx, next);

  assertEquals(next.calls.length, 1);
});

Deno.test("requireToken - blocks request with invalid key", async () => {
  const ctx = testing.createMockContext({
    headers: [["Authorization", "Bearer wrong-key"]],
  });
  const next = spy(testing.createMockNext());

  await requireToken(ctx, next);

  assertEquals(next.calls.length, 0);
  assertEquals(ctx.response.status, 401);
  assertEquals(ctx.response.body, { error: "Unauthorized: Invalid or missing API Key" });
});

Deno.test("requireToken - blocks request with missing header", async () => {
  const ctx = testing.createMockContext({
    headers: [],
  });
  const next = spy(testing.createMockNext());

  await requireToken(ctx, next);

  assertEquals(next.calls.length, 0);
  assertEquals(ctx.response.status, 401);
});
