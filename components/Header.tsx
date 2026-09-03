"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getNavigationHref, navLinks } from "../lib/marketplace-data";
import HeaderAuth from "./HeaderAuth";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E0D8] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full min-w-0 max-w-[1280px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="min-w-0 truncate text-lg font-semibold tracking-tight text-[#1F2937]">BatchNGo</Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => <Link key={link} href={getNavigationHref(link)} className="text-sm font-medium text-[#1F2937] transition hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">{link}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <HeaderAuth />
          <Link href="/post-project" className="rounded-full bg-[#7C8A6A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Get Started</Link>
        </div>
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1F2937] transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A] lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open ? (
        <div className="border-t border-[#E5E0D8] bg-white/98 lg:hidden">
          <div className="mx-auto flex w-full min-w-0 max-w-[1280px] flex-col gap-3 px-5 py-5 sm:px-8">
            {navLinks.map((link) => <Link key={link} href={getNavigationHref(link)} className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]" onClick={() => setOpen(false)}>{link}</Link>)}
            <HeaderAuth mobile onNavigate={() => setOpen(false)} />
            <Link href="/post-project" className="rounded-2xl bg-[#7C8A6A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
