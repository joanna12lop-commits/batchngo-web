"use client";

import { useEffect, useState, type FormEvent } from "react";

type QuoteDraft = {
  projectTitle: string;
  quantity: string;
  targetBudget: string;
  targetTimeline: string;
  message: string;
};

const emptyDraft: QuoteDraft = {
  projectTitle: "",
  quantity: "",
  targetBudget: "",
  targetTimeline: "",
  message: "",
};

export default function QuoteRequestForm({ slug }: { slug: string }) {
  const storageKey = `batchngo-quote-request-${slug}`;
  const [draft, setDraft] = useState<QuoteDraft>(emptyDraft);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setDraft(JSON.parse(stored) as QuoteDraft);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [storageKey]);

  const update = (field: keyof QuoteDraft, value: string) => {
    setSaved(false);
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSaved(true);
  };

  const inputClass = "mt-2 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 py-4 text-base text-[#111111] outline-none transition focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10";

  return (
    <form onSubmit={submit} className="mt-8 space-y-6">
      <label className="block text-sm font-semibold text-[#1F2937]">Project title<input required value={draft.projectTitle} onChange={(event) => update("projectTitle", event.target.value)} className={inputClass} placeholder="e.g. Private-label candle collection" /></label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#1F2937]">Quantity<input required inputMode="numeric" value={draft.quantity} onChange={(event) => update("quantity", event.target.value)} className={inputClass} placeholder="e.g. 250 pcs" /></label>
        <label className="block text-sm font-semibold text-[#1F2937]">Target budget<input required value={draft.targetBudget} onChange={(event) => update("targetBudget", event.target.value)} className={inputClass} placeholder="e.g. $4,000" /></label>
      </div>
      <label className="block text-sm font-semibold text-[#1F2937]">Target timeline<input required value={draft.targetTimeline} onChange={(event) => update("targetTimeline", event.target.value)} className={inputClass} placeholder="e.g. Delivery by October" /></label>
      <label className="block text-sm font-semibold text-[#1F2937]">Short message<textarea required rows={6} value={draft.message} onChange={(event) => update("message", event.target.value)} className={inputClass} placeholder="Describe the product, materials, customization and delivery needs." /></label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="inline-flex items-center justify-center rounded-full bg-[#7C8A6A] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Save request</button>
        {saved ? <p role="status" className="text-sm font-medium text-[#3F684F]">Your request has been saved on this device.</p> : null}
      </div>
    </form>
  );
}
