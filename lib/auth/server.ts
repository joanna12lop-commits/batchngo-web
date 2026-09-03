import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { safeRedirectPath } from "./redirects";
import { isSupabaseConfigured } from "../supabase/config";
import { createClient } from "../supabase/server";

export async function requireAuthenticatedUser(returnTo: string) {
  await connection();
  const next = safeRedirectPath(returnTo);
  if (!isSupabaseConfigured()) redirect("/login?next=" + encodeURIComponent(next));
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) redirect("/login?next=" + encodeURIComponent(next));
  return { user, client };
}
