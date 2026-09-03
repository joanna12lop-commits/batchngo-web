import Link from "next/link";
import type{ReactNode}from"react";
import type{Metadata}from"next";export const metadata:Metadata={title:"Dashboard",robots:{index:false,follow:false}};
import { requireAuthenticatedUser } from "../../lib/auth/server";
export default async function DashboardLayout({children}:{children:ReactNode}){await requireAuthenticatedUser("/dashboard");return <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]"><header className="border-b border-[#E5E0D8] bg-white"><div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8"><Link href="/dashboard" className="text-xl font-semibold">BatchNGo</Link><nav className="flex gap-4 text-sm font-semibold"><Link href="/dashboard">Dashboard</Link><Link href="/account">Account</Link></nav></div></header>{children}</div>}
