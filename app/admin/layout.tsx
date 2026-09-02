import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { getAdminContext } from "../../lib/admin/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await connection();
  const context = await getAdminContext();
  if (!context.ok) redirect(context.status === 401 ? "/login?next=/admin" : "/account");
  return <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]"><header className="border-b border-[#E5E0D8] bg-[#1F2937] text-white"><div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between"><div><Link href="/admin/projects" className="text-xl font-semibold">BatchNGo Admin</Link><p className="mt-1 text-xs text-white/60">Manual marketplace operations</p></div><nav className="flex flex-wrap gap-2 text-sm font-semibold"><Link className="rounded-full px-4 py-2 hover:bg-white/10" href="/admin/projects">Projects</Link><Link className="rounded-full px-4 py-2 hover:bg-white/10" href="/admin/manufacturers">Manufacturers</Link><Link className="rounded-full px-4 py-2 hover:bg-white/10" href="/admin/events">Activity</Link><Link className="rounded-full px-4 py-2 hover:bg-white/10" href="/account">Account</Link></nav></div></header>{children}</div>;
}
