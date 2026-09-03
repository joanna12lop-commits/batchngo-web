"use server";

// `redirect` is imported dynamically inside functions to avoid requiring Next runtime during unit tests
import { safeRedirectPath } from "../../lib/auth/redirects.ts";
import { isSupabaseConfigured } from "../../lib/supabase/config.ts";
import type { AuthActionState } from "./shared.ts";

const value = (data: FormData, key: string) =>
  String(data.get(key) ?? "").trim();
const nextPath = (data: FormData) => safeRedirectPath(value(data, "next"));
const unavailable = (): AuthActionState => ({
  status: "error",
  message: "Authentication is temporarily unavailable. Please try again later.",
});
const invalidCredentials = (): AuthActionState => ({
  status: "error",
  message: "The email or password is incorrect.",
});

export async function signInWithPassword(
  _state: AuthActionState,
  data: FormData,
): Promise<AuthActionState> {
  const next = nextPath(data);
  if (!isSupabaseConfigured()) return unavailable();
  const email = value(data, "email");
  const password = value(data, "password");
  if (!email || !password)
    return { status: "error", message: "Enter your email and password." };
  const { createClient } = await import("../../lib/supabase/server.ts");
  const { error } = await (
    await createClient()
  ).auth.signInWithPassword({ email, password });
  if (error) return invalidCredentials();
  // perform redirect via dynamic import to avoid importing next/navigation at module load
  const { redirect } = await import("next/navigation");
  redirect(next);
  return { status: "success", message: "" };
}

export async function sendMagicLink(
  _state: AuthActionState,
  data: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) return unavailable();
  const email = value(data, "email");
  const next = nextPath(data);
  if (!email) return { status: "error", message: "Enter your email address." };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { createClient } = await import("../../lib/supabase/server.ts");
  const { error } = await (
    await createClient()
  ).auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        siteUrl + "/auth/confirm?next=" + encodeURIComponent(next),
    },
  });
  if (error)
    return {
      status: "error",
      message: "We could not send a sign-in link. Please try again.",
    };
  return {
    status: "success",
    message:
      "If this email can be used to sign in, a secure link is on its way.",
  };
}

export async function signUp(
  _state: AuthActionState,
  data: FormData,
): Promise<AuthActionState> {
  const next = nextPath(data);
  if (!isSupabaseConfigured()) return unavailable();
  const email = value(data, "email");
  const password = value(data, "password");
  const accountType =
    value(data, "accountType") === "manufacturer" ? "manufacturer" : "customer";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8)
    return {
      status: "error",
      message: "Enter a valid email and a password with at least 8 characters.",
    };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const { createClient } = await import("../../lib/supabase/server.ts");
    const { data: result, error } = await (
      await createClient()
    ).auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          siteUrl + "/auth/confirm?next=" + encodeURIComponent(next),
        data: { account_type: accountType },
      },
    });
    if (error)
      return {
        status: "error",
        message:
          error.message ??
          "We could not create the account. Check your details or try signing in.",
      };
    if (result?.session) {
      const { redirect } = await import("next/navigation");
      redirect(next);
    }
    return {
      status: "success",
      message: "Check your email to confirm your address, then sign in.",
    };
  } catch (err) {
    // Surface unexpected errors to the form without throwing to the global error boundary
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while creating the account.";
    return { status: "error", message };
  }
}
