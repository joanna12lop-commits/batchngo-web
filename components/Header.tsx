"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";
import { navLinks } from "../lib/marketplace-data";
import {
  PROJECT_DRAFT_STORAGE_KEY,
  hasMeaningfulProjectDraft,
  readProjectDraft,
} from "../lib/project-draft";
import {
  MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY,
  hasMeaningfulManufacturerApplicationDraft,
  readManufacturerApplicationDraft,
} from "../lib/manufacturer-application-draft";

type HeaderProps = { compact?: boolean };
type ModalView = "account-type" | "project-draft" | "confirm-new" | "manufacturer-draft" | "confirm-new-manufacturer";

export default function Header({ compact = false }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("account-type");
  const modalRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setPortalReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const getNavHref = (link: string) => {
    switch (link) {
      case "Find Makers": return "/find-makers";
      case "How It Works": return "/#how-it-works";
      case "Categories": return "/#categories";
      case "For Manufacturers": return "/for-manufacturers/apply";
      default: return `#${link.toLowerCase().replace(/\s+/g, "-")}`;
    }
  };

  const openGetStarted = (opener: HTMLElement) => {
    openerRef.current = opener;
    setModalView("account-type");
    setShowGetStarted(true);
    setOpen(false);
  };

  const closeGetStarted = () => {
    setShowGetStarted(false);
    setModalView("account-type");
    window.requestAnimationFrame(() => openerRef.current?.focus());
  };

  const createProduct = () => {
    if (hasMeaningfulProjectDraft(readProjectDraft())) {
      setModalView("project-draft");
      return;
    }
    closeGetStarted();
    router.push("/post-project?new=1");
  };

  const startNewProject = () => {
    window.localStorage.removeItem(PROJECT_DRAFT_STORAGE_KEY);
    closeGetStarted();
    router.push("/post-project?new=1");
  };

  const continueProject = () => {
    closeGetStarted();
    router.push("/post-project");
  };

  const joinAsManufacturer = () => {
    if (hasMeaningfulManufacturerApplicationDraft(readManufacturerApplicationDraft())) {
      setModalView("manufacturer-draft");
      return;
    }
    closeGetStarted();
    router.push("/for-manufacturers/apply?new=1");
  };

  const continueManufacturerApplication = () => {
    closeGetStarted();
    router.push("/for-manufacturers/apply");
  };

  const startNewManufacturerApplication = () => {
    window.localStorage.removeItem(MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY);
    closeGetStarted();
    router.push("/for-manufacturers/apply?new=1");
  };

  useEffect(() => {
    if (!showGetStarted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [showGetStarted]);

  useEffect(() => {
    if (!showGetStarted) return;

    const focusableSelector = "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    window.requestAnimationFrame(() => {
      modalRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGetStarted();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showGetStarted, modalView]);

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
          <div className="flex items-center gap-4"><Link href="/dashboard" className="text-sm font-semibold text-[#667255]">Dashboard</Link><Link href="/account" className="text-sm font-semibold text-[#1F2937]">My Account</Link></div>
        ) : (
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="text-sm font-medium text-[#1F2937] transition hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Log in</Link>
            <button type="button" onClick={(event) => openGetStarted(event.currentTarget)} className="rounded-full bg-[#7C8A6A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Get Started</button>
          </div>
        )}

        {!compact ? (
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1F2937] transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A] md:hidden" aria-label="Open menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        ) : null}
      </div>

      {showGetStarted && portalReady ? createPortal(
        <div className="fixed inset-0 z-[100] flex h-dvh w-full items-center justify-center overflow-hidden bg-[#111111]/40 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeGetStarted(); }}>
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="get-started-title" className={`relative w-full max-h-[calc(100dvh-48px)] overflow-x-hidden overflow-y-auto rounded-[32px] border border-[#E5E0D8] bg-[#F6F3EE] p-6 shadow-2xl sm:p-8 ${modalView === "account-type" ? "max-w-[860px]" : "max-w-[620px]"}`} onMouseDown={(event) => event.stopPropagation()}>
            {modalView === "account-type" ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">What would you like to do?</p><h2 id="get-started-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Choose your path</h2></div>
                  <button type="button" onClick={closeGetStarted} className="rounded-full border border-[#E5E0D8] bg-white p-3 text-[#1F2937] transition hover:bg-[#EEF1E8]" aria-label="Close modal"><X size={18} /></button>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <button type="button" onClick={createProduct} className="flex h-full flex-col justify-between rounded-[28px] border border-[#E5E0D8] bg-white p-6 text-left transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">
                    <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Buyer</p><h3 className="mt-4 text-2xl font-semibold text-[#111111]">Create a product</h3><p className="mt-4 text-sm leading-relaxed text-[#7C7A74]">Post a production project and receive quotes from verified makers.</p></div>
                    <span className="mt-6 inline-flex items-center rounded-full bg-[#EEF1E8] px-4 py-2 text-sm font-semibold text-[#7C8A6A]">Start here</span>
                  </button>
                  <button type="button" onClick={joinAsManufacturer} className="flex h-full flex-col justify-between rounded-[28px] border border-[#E5E0D8] bg-white p-6 text-left transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">
                    <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Manufacturer</p><h3 className="mt-4 text-2xl font-semibold text-[#111111]">Join as a manufacturer</h3><p className="mt-4 text-sm leading-relaxed text-[#7C7A74]">Apply to become a verified production partner and receive project requests.</p></div>
                    <span className="mt-6 inline-flex items-center rounded-full bg-[#EEF1E8] px-4 py-2 text-sm font-semibold text-[#7C8A6A]">Apply now</span>
                  </button>
                </div>
              </>
            ) : modalView === "project-draft" ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Create a product</p><h2 id="get-started-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Continue your project?</h2><p className="mt-4 text-sm leading-7 text-[#7C7A74]">You have a saved production project.</p></div>
                  <button type="button" onClick={closeGetStarted} className="rounded-full border border-[#E5E0D8] bg-white p-3 text-[#1F2937] transition hover:bg-[#EEF1E8]" aria-label="Close modal"><X size={18} /></button>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <button type="button" onClick={continueProject} className="rounded-[28px] border border-[#E5E0D8] bg-white p-6 text-left transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"><h3 className="text-xl font-semibold text-[#111111]">Continue saved project</h3><p className="mt-3 text-sm leading-7 text-[#7C7A74]">Resume where you left off.</p></button>
                  <button type="button" onClick={() => setModalView("confirm-new")} className="rounded-[28px] border border-[#E5E0D8] bg-white p-6 text-left transition hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"><h3 className="text-xl font-semibold text-[#111111]">Start a new project</h3><p className="mt-3 text-sm leading-7 text-[#7C7A74]">Create a new production brief.</p></button>
                </div>
                <button type="button" onClick={() => setModalView("account-type")} className="mt-6 inline-flex items-center text-sm font-semibold text-[#7C7A74] transition hover:text-[#111111]"><ArrowLeft size={16} className="mr-2" />Back to account type</button>
              </>
            ) : modalView === "confirm-new" ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">New project</p><h2 id="get-started-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Start a new project?</h2><p className="mt-4 text-sm leading-7 text-[#7C7A74]">Your current saved draft will be removed.</p></div>
                  <button type="button" onClick={closeGetStarted} className="rounded-full border border-[#E5E0D8] bg-white p-3 text-[#1F2937] transition hover:bg-[#EEF1E8]" aria-label="Close modal"><X size={18} /></button>
                </div>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalView("project-draft")} className="rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8]">Cancel</button><button type="button" onClick={startNewProject} className="rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255]">Start new project</button></div>
              </>
            ) : modalView === "manufacturer-draft" ? (
              <>
                <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Join as a manufacturer</p><h2 id="get-started-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Continue your application?</h2><p className="mt-4 text-sm leading-7 text-[#7C7A74]">You have a saved manufacturer application.</p></div><button type="button" onClick={closeGetStarted} className="rounded-full border border-[#E5E0D8] bg-white p-3 text-[#1F2937]" aria-label="Close modal"><X size={18} /></button></div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2"><button type="button" onClick={continueManufacturerApplication} className="rounded-[28px] border border-[#E5E0D8] bg-white p-6 text-left transition hover:border-[#7C8A6A]"><h3 className="text-xl font-semibold text-[#111111]">Continue saved application</h3><p className="mt-3 text-sm leading-7 text-[#7C7A74]">Resume where you left off.</p></button><button type="button" onClick={() => setModalView("confirm-new-manufacturer")} className="rounded-[28px] border border-[#E5E0D8] bg-white p-6 text-left transition hover:border-[#7C8A6A]"><h3 className="text-xl font-semibold text-[#111111]">Start a new application</h3><p className="mt-3 text-sm leading-7 text-[#7C7A74]">Create a new manufacturer application.</p></button></div>
                <button type="button" onClick={() => setModalView("account-type")} className="mt-6 inline-flex items-center text-sm font-semibold text-[#7C7A74]"><ArrowLeft size={16} className="mr-2" />Back to account type</button>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">New application</p><h2 id="get-started-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Start a new application?</h2><p className="mt-4 text-sm leading-7 text-[#7C7A74]">Your current saved application will be removed.</p></div><button type="button" onClick={closeGetStarted} className="rounded-full border border-[#E5E0D8] bg-white p-3 text-[#1F2937]" aria-label="Close modal"><X size={18} /></button></div>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setModalView("manufacturer-draft")} className="rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold">Cancel</button><button type="button" onClick={startNewManufacturerApplication} className="rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white">Start new application</button></div>
              </>
            )}
          </div>
        </div>,
        document.body,
      ) : null}

      {!compact && open ? (
        <div className="border-t border-[#E5E0D8] bg-white/98 md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-5 sm:px-8">
            {navLinks.map((link) => <Link key={link} href={getNavHref(link)} className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8]" onClick={() => setOpen(false)}>{link}</Link>)}
            <Link href="/login" className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1F2937] transition hover:bg-[#EEF1E8]" onClick={() => setOpen(false)}>Log in</Link>
            <button type="button" onClick={(event) => openGetStarted(event.currentTarget)} className="rounded-2xl bg-[#7C8A6A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#667255]">Get Started</button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
