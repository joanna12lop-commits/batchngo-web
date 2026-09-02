"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "../lib/marketplace-data";

type HeaderProps = { compact?: boolean };

export default function Header({ compact = false }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const getNavHref = (link: string) => {
    switch (link) {
      case "Find Makers": return "/find-makers";
      case "How It Works": return "/#how-it-works";
      case "Categories": return "/#categories";
      case "For Manufacturers": return "/for-manufacturers/apply";
      default: return `#${link.toLowerCase().replace(/\s+/g, "-")}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E0D8] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#1F2937]">BatchNGo</Link>
        {!compact ? (
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => <Link key={link} href={getNavHref(link)} className="text-sm font-medium text-[#1F2937] transition hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">{link}</Link>)}
          </nav>
        ) : null}
        {compact ? (
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-[#667255]">Back to home</Link>
            <Link href="/find-makers" className="text-sm font-semibold text-[#1F2937]">Browse Makers</Link>
          </div>
        ) : (
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-[#1F2937] transition hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Log in</Link>
            <Link href="/post-project" className="rounded-full bg-[#7C8A6A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Get Started</Link>
          </div>
        )}
        {!compact ? (
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1F2937] transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A] md:hidden" aria-label="Open menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        ) : null}
      </div>
      {!compact && open ? (
        <div className="border-t border-[#E5E0D8] bg-white/98 md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-5 sm:px-8">
            {navLinks.map((link) => <Link key={link} href={getNavHref(link)} className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8]" onClick={() => setOpen(false)}>{link}</Link>)}
            <Link href="/login" className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8]" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/post-project" className="rounded-2xl bg-[#7C8A6A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#667255]" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
