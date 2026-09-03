import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./config";
import type { Database } from "./database.types";
import { isProtectedPath, loginRedirectUrl } from "../auth/redirects";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const protectedRoute = isProtectedPath(request.nextUrl.pathname);
  if (!isSupabaseConfigured()) return protectedRoute ? NextResponse.redirect(loginRedirectUrl(request.url)) : response;
  const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: claimsData } = await supabase.auth.getClaims();
  if (protectedRoute && !claimsData?.claims.sub) {
    const redirectResponse = NextResponse.redirect(loginRedirectUrl(request.url));
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }
  return response;
}
