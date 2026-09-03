import type { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getContext(testSupabase?: SupabaseClient | any) {
  // Avoid static imports of supabase/server so tests can mock without resolving Next internals.
  try {
    const mod = await import("../../../../lib/supabase/server.ts");
    const supabase: any = testSupabase ?? (await mod.createClient());
    if (
      !supabase ||
      !supabase.auth ||
      typeof supabase.auth.getUser !== "function"
    )
      return null;
    const {
      data: { user },
    } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    return profile?.role === "customer" ? { supabase, user } : null;
  } catch {
    return null;
  }
}

export default getContext;
