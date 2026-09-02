"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Save, ShieldCheck } from "lucide-react";
import Header from "../../../components/Header";
import {
  createEmptyProjectDraft,
  readProjectDraft,
  writeProjectDraft,
  type ProjectStep3,
} from "../../../lib/project-draft";

const pricePriorityOptions = [
  "Lowest unit price",
  "Product quality",
  "Low minimum order",
  "Fast turnaround",
  "Sustainable materials",
];

function ProgressBar() {
  const steps = ["Product Category", "Technical Details", "Quantity & Budget", "Timeline", "Review"];
  return (
    <div className="mb-16 overflow-x-auto no-scrollbar">
      <div className="flex min-w-[900px] items-center justify-between rounded-2xl border border-[#E5E0D8] bg-white px-10 py-4 shadow-sm">
        {steps.map((step, index) => (
          <div key={step} className="contents">
            <div className={`flex items-center space-x-3 ${index > 2 ? "text-[#7C7A74]/60" : "text-[#111111]"}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${index <= 2 ? "border-[#7C8A6A] bg-[#7C8A6A] text-white" : "border-[#E5E0D8]"}`}>
                {index < 2 ? <Check size={14} /> : index + 1}
              </span>
              <span className={`text-sm tracking-tight ${index <= 2 ? "font-bold" : "font-medium"}`}>{step}</span>
            </div>
            {index < steps.length - 1 ? <div className={`mx-6 h-px flex-grow ${index < 2 ? "bg-[#7C8A6A]" : "bg-[#E5E0D8]"}`} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuantityBudgetPage() {
  const router = useRouter();
  const [step3, setStep3] = useState<ProjectStep3>(
    () => createEmptyProjectDraft().step3,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const quantityRef = useRef<HTMLInputElement>(null);
  const maximumBudgetRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLSelectElement>(null);
  const budgetTypeRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const loadDraft = () => {
      const draft = readProjectDraft();
      if (draft) setStep3(draft.step3);
    };
    loadDraft();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const update = <K extends keyof ProjectStep3>(field: K, value: ProjectStep3[K]) => {
    setStep3((current) => ({ ...current, [field]: value }));
  };

  const togglePriority = (option: string) => {
    update(
      "pricePriorities",
      step3.pricePriorities.includes(option)
        ? step3.pricePriorities.filter((item) => item !== option)
        : [...step3.pricePriorities, option],
    );
  };

  const quantityValid = Number(step3.orderQuantity) > 0;
  const budgetRangeValid = useMemo(() => {
    if (!step3.minimumBudget || !step3.maximumBudget) return true;
    return Number(step3.minimumBudget) <= Number(step3.maximumBudget);
  }, [step3.minimumBudget, step3.maximumBudget]);
  const isValid = quantityValid && Boolean(step3.currency) && Boolean(step3.budgetType) && budgetRangeValid;

  const saveDraft = () => {
    writeProjectDraft({ step3 });
    setMessage("Draft saved locally.");
  };

  const nextStep = () => {
    setAttempted(true);
    if (!isValid) {
      window.setTimeout(() => { const first = !quantityValid ? quantityRef.current : !budgetRangeValid ? maximumBudgetRef.current : !step3.currency ? currencyRef.current : budgetTypeRef.current; first?.scrollIntoView({behavior:"smooth",block:"center"}); first?.focus(); }, 0);
      return;
    }
    writeProjectDraft({ step3 });
    router.push("/post-project/timeline");
  };

  const inputClass = "w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-6 py-5 text-lg text-[#111111] outline-none transition-all placeholder:text-[#7C7A74]/50 focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10";
  const labelClass = "mb-4 block text-sm font-bold uppercase tracking-widest text-[#1F2937]";

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-8">
        <ProgressBar />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-12">
            <div className="rounded-[2rem] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-12">
              <header className="mb-12">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#111111]">Set your quantity and budget</h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#7C7A74]">Share your expected order volume and budget range so makers can prepare relevant production quotes.</p>
              </header>

              <div className="space-y-12">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="order-quantity" className={labelClass}>Order quantity · Required</label>
                    <input ref={quantityRef} id="order-quantity" type="number" min="1" inputMode="numeric" value={step3.orderQuantity} onChange={(event) => update("orderQuantity", event.target.value)} placeholder="e.g. 500" aria-invalid={attempted&&!quantityValid||undefined} aria-describedby={attempted&&!quantityValid?"quantity-error":undefined} className={`${inputClass} ${attempted&&!quantityValid?"border-[#C9826B] bg-[#F5E6E0]/30":""}`} />
                    {attempted&&!quantityValid ? <p id="quantity-error" className="mt-3 text-sm text-[#C9826B]">Enter a quantity greater than 0</p> : null}
                  </div>
                  <div>
                    <label htmlFor="quantity-flexibility" className={labelClass}>Quantity flexibility</label>
                    <select id="quantity-flexibility" value={step3.quantityFlexibility} onChange={(event) => update("quantityFlexibility", event.target.value)} className={inputClass}>
                      <option value="">Select flexibility</option><option>Fixed quantity</option><option>Some flexibility</option><option>Open to maker recommendation</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div><label htmlFor="minimum-budget" className={labelClass}>Minimum budget</label><input id="minimum-budget" type="number" min="0" inputMode="decimal" value={step3.minimumBudget} onChange={(event) => update("minimumBudget", event.target.value)} placeholder="e.g. 2500" className={inputClass} /></div>
                  <div><label htmlFor="maximum-budget" className={labelClass}>Maximum budget</label><input ref={maximumBudgetRef} id="maximum-budget" type="number" min="0" inputMode="decimal" value={step3.maximumBudget} onChange={(event) => update("maximumBudget", event.target.value)} placeholder="e.g. 5000" aria-invalid={attempted&&!budgetRangeValid||undefined} aria-describedby={attempted&&!budgetRangeValid?"budget-range-error":undefined} className={`${inputClass} ${attempted&&!budgetRangeValid?"border-[#C9826B] bg-[#F5E6E0]/30":""}`} />{attempted&&!budgetRangeValid ? <p id="budget-range-error" className="mt-3 text-sm text-[#C9826B]">Minimum budget cannot exceed maximum budget</p> : null}</div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div><label htmlFor="currency" className={labelClass}>Currency · Required</label><select ref={currencyRef} id="currency" value={step3.currency} onChange={(event) => update("currency", event.target.value)} aria-invalid={attempted&&!step3.currency||undefined} aria-describedby={attempted&&!step3.currency?"currency-error":undefined} className={`${inputClass} ${attempted&&!step3.currency?"border-[#C9826B] bg-[#F5E6E0]/30":""}`}><option value="USD">USD — U.S. Dollar</option></select>{attempted&&!step3.currency ? <p id="currency-error" className="mt-3 text-sm text-[#C9826B]">Select a currency</p> : null}</div>
                  <div><label htmlFor="budget-type" className={labelClass}>Budget type · Required</label><select ref={budgetTypeRef} id="budget-type" value={step3.budgetType} onChange={(event) => update("budgetType", event.target.value)} aria-invalid={attempted&&!step3.budgetType||undefined} aria-describedby={attempted&&!step3.budgetType?"budget-type-error":undefined} className={`${inputClass} ${attempted&&!step3.budgetType?"border-[#C9826B] bg-[#F5E6E0]/30":""}`}><option value="">Select budget type</option><option>Total project budget</option><option>Target unit price</option><option>Flexible budget</option></select>{attempted&&!step3.budgetType ? <p id="budget-type-error" className="mt-3 text-sm text-[#C9826B]">Select a budget type</p> : null}</div>
                </div>

                <div><label htmlFor="sample-budget" className={labelClass}>Sample budget</label><input id="sample-budget" type="number" min="0" inputMode="decimal" value={step3.sampleBudget} onChange={(event) => update("sampleBudget", event.target.value)} placeholder="e.g. 150" className={inputClass} /></div>

                <div>
                  <p className={labelClass}>Price priorities</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {pricePriorityOptions.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-2xl p-4 text-sm font-semibold transition ${step3.pricePriorities.includes(option) ? "border-2 border-[#7C8A6A] bg-[#EEF1E8]" : "border border-[#E5E0D8] bg-[#F6F3EE]/50 hover:border-[#7C8A6A]"}`}><input type="checkbox" checked={step3.pricePriorities.includes(option)} onChange={() => togglePriority(option)} className="h-4 w-4 rounded border-[#E5E0D8] text-[#7C8A6A] focus:ring-[#7C8A6A]" />{option}</label>)}
                  </div>
                </div>

                <div><label htmlFor="budget-notes" className={labelClass}>Additional budget notes</label><textarea id="budget-notes" rows={5} value={step3.additionalBudgetNotes} onChange={(event) => update("additionalBudgetNotes", event.target.value)} placeholder="Add any pricing context, trade-offs, or target cost details." className={inputClass} /></div>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/post-project/details" className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#7C7A74] transition-all hover:border-[#111111] hover:text-[#111111]"><ArrowLeft size={16} className="mr-2" />Back</Link>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button type="button" onClick={saveDraft} className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#7C7A74] transition-all hover:border-[#111111] hover:text-[#111111]"><Save size={16} className="mr-2" />Save as draft</button>
                <button type="button" onClick={nextStep} className="flex items-center justify-center rounded-full bg-[#7C8A6A] px-12 py-5 text-lg font-bold text-white shadow-xl shadow-[#7C8A6A]/10 transition-all hover:bg-[#667255]">Next Step<ArrowRight size={18} className="ml-3" /></button>
              </div>
            </div>
            {message ? <div role="status" className="rounded-2xl border border-[#7C8A6A] bg-[#EEF1E8] px-6 py-4 text-sm text-[#1F2937]">{message}</div> : null}
          </div>

          <aside className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white p-10 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#7C8A6A]/10" />
              <h3 className="mb-8 text-xl font-bold text-[#111111]">Guided Production</h3>
              <ul className="space-y-8">
                <li className="flex items-start space-x-5"><div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF2EC] text-[#3F684F]"><Check size={15} /></div><div><h4 className="mb-1 text-sm font-bold text-[#111111]">Product Definition</h4><p className="text-xs leading-relaxed text-[#7C7A74]">Completed</p></div></li>
                <li className="flex items-start space-x-5"><div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF2EC] text-[#3F684F]"><Check size={15} /></div><div><h4 className="mb-1 text-sm font-bold text-[#111111]">Technical Specs</h4><p className="text-xs leading-relaxed text-[#7C7A74]">Completed</p></div></li>
                <li className="flex items-start space-x-5"><div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#7C8A6A] text-xs font-bold text-white">3</div><div><h4 className="mb-1 text-sm font-bold text-[#111111]">Volume & Logistics</h4><p className="text-xs leading-relaxed text-[#7C7A74]">Set order volume and budget expectations.</p></div></li>
              </ul>
              <div className="mt-10 border-t border-[#E5E0D8] pt-6"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C8A6A]"><ShieldCheck size={15} />Tip</div><p className="mt-3 text-sm leading-7 text-[#7C7A74]">A realistic budget range helps makers recommend the right materials and production approach.</p></div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
