import { NextResponse } from "next/server";
import { safeRedirectPath } from "../../../lib/auth/redirects";
import { isSupabaseConfigured } from "../../../lib/supabase/config";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeRedirectPath(url.searchParams.get("next"));
  if (code && isSupabaseConfigured()) {
    const { error } = await (await createClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/login?message=confirmation-failed&next=" + encodeURIComponent(next), url.origin));
}
