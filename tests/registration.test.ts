import assert from "node:assert/strict";
import test from "node:test";
import { initialAuthState } from "../app/login/shared.ts";
import { signUp } from "../app/login/actions.ts";

test("signUp returns validation error for invalid input instead of throwing", async () => {
  const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
  const data = new FormData();
  data.set("email", "bad-email");
  data.set("password", "short");
  data.set("accountType", "customer");
  const result = await signUp(initialAuthState, data);
  assert.equal(result.status, "error");
  assert.match(result.message, /valid email/i);
  if (prevUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
  if (prevKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevKey;
});

test("signUp returns unavailable when Supabase not configured", async () => {
  const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prevKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const data = new FormData();
  data.set("email", "test@example.com");
  data.set("password", "longenough");
  data.set("accountType", "customer");
  const result = await signUp(initialAuthState, data);
  assert.equal(result.status, "error");
  assert.match(result.message, /temporarily unavailable/i);
  if (prevUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
  if (prevKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevKey;
});
