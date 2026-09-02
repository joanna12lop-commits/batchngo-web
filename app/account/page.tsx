import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { createClient } from "../../lib/supabase/server";
import { signOut } from "./actions";

export default async function AccountPage() {
  if (!isSupabaseConfigured()) return <div className="min-h-screen bg-[#F6F3EE]"><Header/><main className="mx-auto max-w-3xl px-4 py-24"><section className="rounded-[32px] border border-[#E5E0D8] bg-white p-10"><h1 className="text-4xl font-semibold">Connect Supabase to enable accounts</h1><p className="mt-4 text-[#7C7A74]">Copy .env.example to .env.local and add your project URL and publishable key.</p></section></main></div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="min-h-screen bg-[#F6F3EE]"><Header/><main className="mx-auto max-w-3xl px-4 py-24"><section className="rounded-[32px] border border-[#E5E0D8] bg-white p-10"><h1 className="text-4xl font-semibold">Sign in to your account</h1><p className="mt-4 text-[#7C7A74]">Your projects and manufacturer application will appear here after you sign in.</p><Link href="/login" className="mt-8 inline-flex rounded-full bg-[#7C8A6A] px-6 py-3 font-semibold text-white">Sign in</Link></section></main><Footer/></div>;
  const [{ data: profile }, { data: projects }] = await Promise.all([
    supabase.from("profiles").select("role,full_name,company_name").eq("id", user.id).maybeSingle(),
    supabase.from("projects").select("id,title,status,updated_at").eq("customer_id", user.id).order("updated_at", { ascending: false }).limit(20),
  ]);
  return <div className="min-h-screen bg-[#F6F3EE]"><Header/><main className="mx-auto max-w-4xl px-4 py-24"><section className="rounded-[32px] border border-[#E5E0D8] bg-white p-10"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">{profile?.role??"Account"}</p><h1 className="mt-4 text-4xl font-semibold">Welcome to BatchNGo</h1><p className="mt-4 text-[#7C7A74]">Signed in as {user.email}</p><div className="mt-8 flex flex-wrap gap-3">{profile?.role==="admin"?<Link href="/admin" className="rounded-full bg-[#1F2937] px-6 py-3 font-semibold text-white">Open admin panel</Link>:<Link href={profile?.role==="manufacturer"?"/for-manufacturers/apply":"/post-project"} className="rounded-full bg-[#7C8A6A] px-6 py-3 font-semibold text-white">{profile?.role==="manufacturer"?"Open manufacturer application":"Post a project"}</Link>}<form action={signOut}><button className="rounded-full border border-[#E5E0D8] px-6 py-3 font-semibold">Sign out</button></form></div></section>{profile?.role==="customer"?<section className="mt-6 rounded-[32px] border border-[#E5E0D8] bg-white p-8"><h2 className="text-2xl font-semibold">Your projects</h2><div className="mt-5 space-y-3">{(projects??[]).map((project)=><div key={project.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F6F3EE] p-4"><div><strong>{project.title}</strong><p className="mt-1 text-xs text-[#7C7A74]">Updated {new Date(project.updated_at).toLocaleDateString("en-US")}</p></div><span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-bold text-[#667255]">{project.status.replaceAll("_"," ")}</span></div>)}{!projects?.length?<p className="text-sm text-[#7C7A74]">No saved projects yet.</p>:null}</div></section>:null}</main></div>;
}
