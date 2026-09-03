import "server-only";

import { connection } from "next/server";
import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/server";
import { authorizeAdminRole } from "./authorization";
import { isSupabaseConfigured } from "../supabase/config";

export async function getAdminContext() {
  await connection();
  if (!isSupabaseConfigured()) return { ok: false as const, status: 401 as const, error: "Unauthorized" as const };
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { ok: false as const, status: 401 as const, error: "Unauthorized" as const };
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const decision = authorizeAdminRole(profile?.role ?? null, true);
  if (!decision.allowed) return { ok: false as const, ...decision };
  return { ok: true as const, user, admin: createAdminClient() };
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
