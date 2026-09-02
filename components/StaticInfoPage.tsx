import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

export default function StaticInfoPage({ eyebrow, title, description, actionHref = "/", actionLabel = "Back to home" }: { eyebrow: string; title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]"><Header /><main className="mx-auto flex min-h-[65vh] max-w-4xl items-center px-4 py-20 sm:px-8"><section className="w-full rounded-[32px] border border-[#E5E0D8] bg-white p-8 shadow-sm sm:p-12"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">{eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-[#7C7A74]">{description}</p><Link href={actionHref} className="mt-8 inline-flex rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">{actionLabel}</Link></section></main><Footer /></div>;
}
