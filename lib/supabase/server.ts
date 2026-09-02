import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "./config";
import type { Database } from "./database.types";

export async function createClient() {
  const { url, key } = getPublicSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient<Database>(url, key, { cookies: { getAll: () => cookieStore.getAll(), setAll: (cookiesToSet) => { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot write cookies; proxy refreshes them. */ } } } });
}
