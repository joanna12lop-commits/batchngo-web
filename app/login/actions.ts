"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { createClient } from "../../lib/supabase/server";

const value = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const safeNext = (data: FormData) => {
  const next = value(data, "next");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
};
const destination = (message: string, next: string) =>
  `/login?message=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`;

export async function signInWithPassword(data: FormData) {
  const next = safeNext(data);
  if (!isSupabaseConfigured()) redirect(destination("Supabase is not configured.", next));
  const email = value(data, "email");
  const password = value(data, "password");
  if (!email || !password) redirect(destination("Enter your email and password.", next));
  const { error } = await (await createClient()).auth.signInWithPassword({ email, password });
  if (error) redirect(destination(error.message, next));
  redirect(next);
}

export async function sendMagicLink(data: FormData) {
  const next = safeNext(data);
  if (!isSupabaseConfigured()) redirect(destination("Supabase is not configured.", next));
  const email = value(data, "email");
  if (!email) redirect(destination("Enter your email address.", next));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await (await createClient()).auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error) redirect(destination(error.message, next));
  redirect(destination("Check your email for a secure sign-in link.", next));
}

export async function signUp(data: FormData) {
  const next = safeNext(data);
  if (!isSupabaseConfigured()) redirect(destination("Supabase is not configured.", next));
  const email = value(data, "email");
  const password = value(data, "password");
  const accountType = value(data, "accountType") === "manufacturer" ? "manufacturer" : "customer";
  if (!email || password.length < 8) {
    redirect(destination("Enter a valid email and a password with at least 8 characters.", next));
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await (await createClient()).auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`,
      data: { account_type: accountType },
    },
  });
  if (error) redirect(destination(error.message, next));
  redirect(destination("Account created. Check your email to confirm your address.", next));
}
