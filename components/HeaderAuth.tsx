"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "../app/account/actions";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { createClient } from "../lib/supabase/client";

export default function HeaderAuth({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const configured = isSupabaseConfigured();
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(!configured);
  useEffect(() => {
    if (!configured) return;
    const client = createClient();
    void client.auth.getUser().then(({ data }) => { setAuthenticated(Boolean(data.user)); setReady(true); });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => { setAuthenticated(Boolean(session?.user)); setReady(true); });
    return () => listener.subscription.unsubscribe();
  }, [configured]);
  const linkClass = mobile ? "rounded-2xl px-4 py-3 text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]" : "text-sm font-medium text-[#1F2937] transition hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]";
  const buttonClass = mobile ? "rounded-2xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]" : linkClass;
  if (!ready || !authenticated) return <Link href="/login" className={linkClass} onClick={onNavigate}>Log in</Link>;
  return <>
    <Link href="/dashboard" className={linkClass} onClick={onNavigate}>Dashboard</Link>
    <Link href="/account" className={linkClass} onClick={onNavigate}>Account</Link>
    <form action={signOut} className={mobile ? "contents" : undefined}><button className={buttonClass}>Log out</button></form>
  </>;
}
