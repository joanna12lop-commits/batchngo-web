"use client";
import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "./config";
import type { Database } from "./database.types";

export function createClient() {
  const { url, key } = getPublicSupabaseConfig();
  return createBrowserClient<Database>(url, key);
}
