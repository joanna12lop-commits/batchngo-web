"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import Header from "../../../components/Header";
import { PROJECT_DRAFT_SESSION_KEY, PROJECT_DRAFT_STORAGE_KEY, createEmptyProjectDraft, readProjectDraft, type ProjectDraft } from "../../../lib/project-draft";
import { formatUSAddress, getMarketplaceCategoryBySlug, resolveMarketplaceCategorySlug } from "../../../lib/us-marketplace-taxonomy";
import { getTechnicalReviewItems, PROJECT_SPECIFICATIONS } from "../../../lib/project-specifications";

function ProgressBar() {
  const steps = ["Product Category", "Technical Details", "Quantity & Budget", "Timeline", "Review"];
  return <div className="mb-16 max-w-full overflow-x-auto overscroll-x-contain no-scrollbar"><div className="flex w-max min-w-[900px] items-center justify-between rounded-2xl border border-[#E5E0D8] bg-white px-10 py-4 shadow-sm">{steps.map((step, index) => <div key={step} className="contents"><div className="flex items-center space-x-3 text-[#111111]"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7C8A6A] bg-[#7C8A6A] text-xs font-bold text-white">{index < 4 ? <Check size={14} /> : 5}</span><span className="text-sm font-bold tracking-tight">{step}</span></div>{index < 4 ? <div className="mx-6 h-px flex-grow bg-[#7C8A6A]" /> : null}</div>)}</div></div>;
}

function ReviewSection({ title, editHref, children }: { title: string; editHref: string; children: React.ReactNode }) {
  return <section className="min-w-0 rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-[#111111]">{title}</h2><Link href={editHref} className="text-sm font-semibold text-[#7C8A6A] underline decoration-[#7C8A6A]/30 underline-offset-4">Edit</Link></div><dl className="mt-6 grid gap-5 sm:grid-cols-2">{children}</dl></section>;
}

function Item({ label, value }: { label: string; value?: string | number }) {
  return <div><dt className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C7A74]">{label}</dt><dd className="mt-2 break-words text-sm leading-7 text-[#1F2937]">{value || "Not provided"}</dd></div>;
}

const list = (items: string[]) => items.length ? items.join(", ") : "Not provided";

export default function ReviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectDraft>(() => createEmptyProjectDraft());
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const categorySlug = resolveMarketplaceCategorySlug(draft.step1.selectedCategory);
  const category = getMarketplaceCategoryBySlug(categorySlug);
  const technicalItems = categorySlug ? getTechnicalReviewItems(draft.step2, PROJECT_SPECIFICATIONS[categorySlug]) : [];

  useEffect(() => { const loadDraft = () => setDraft(readProjectDraft() ?? createEmptyProjectDraft()); loadDraft(); }, []);

  const submitProject = async () => {
    setSubmitting(true); setSubmitError(null);
    try { const response=await fetch("/api/submit/project",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({draft})}); if(response.status===401){router.push("/login?next=/post-project/review");return} const body=await response.json() as {error?:string;details?:string[]}; if(!response.ok)throw new Error(body.details?.join(" ")||body.error||"Unable to submit project."); window.localStorage.removeItem(PROJECT_DRAFT_STORAGE_KEY); window.sessionStorage.removeItem(PROJECT_DRAFT_SESSION_KEY); setConfirmSubmit(false); router.push("/post-project/success"); } catch(error){setSubmitError(error instanceof Error?error.message:"Unable to submit project. Your draft is still safe.");} finally {setSubmitting(false);}
  };

  return <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
    <Header />
    <main className="mx-auto w-full min-w-0 max-w-7xl px-4 pb-24 pt-32 sm:px-8">
      <ProgressBar />
      <header className="mb-10"><h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl text-[#111111]">Review your project</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#7C7A74]">Check the full production brief before completing this frontend submission flow.</p></header>
      <div className="space-y-6">
        <ReviewSection title="Product Category" editHref="/post-project"><Item label="Category" value={category?.name} /><Item label="Project title" value={draft.step1.projectTitle} /><div className="sm:col-span-2"><Item label="Product description" value={draft.step1.description} /></div><Item label="Reference files" value={draft.step1.referenceImages.length ? draft.step1.referenceImages.map((image) => image.name).join(", ") : "Not provided"} /></ReviewSection>
        <ReviewSection title="Technical Details" editHref="/post-project/details">{technicalItems.map(([label,value])=><Item key={label} label={label} value={value}/>)}</ReviewSection>
        <ReviewSection title="Quantity & Budget" editHref="/post-project/quantity-budget"><Item label="Order quantity" value={draft.step3.orderQuantity} /><Item label="Quantity flexibility" value={draft.step3.quantityFlexibility} /><Item label="Minimum budget" value={draft.step3.minimumBudget ? `${draft.step3.minimumBudget} ${draft.step3.currency}` : "Not provided"} /><Item label="Maximum budget" value={draft.step3.maximumBudget ? `${draft.step3.maximumBudget} ${draft.step3.currency}` : "Not provided"} /><Item label="Budget type" value={draft.step3.budgetType} /><Item label="Sample budget" value={draft.step3.sampleBudget ? `${draft.step3.sampleBudget} ${draft.step3.currency}` : "Not provided"} /><Item label="Price priorities" value={list(draft.step3.pricePriorities)} /><Item label="Budget notes" value={draft.step3.additionalBudgetNotes} /></ReviewSection>
        <ReviewSection title="Timeline" editHref="/post-project/timeline"><Item label="Target delivery" value={draft.step4.targetDeliveryDate} /><Item label="Flexibility" value={draft.step4.timelineFlexibility} /><Item label="Sample deadline" value={draft.step4.sampleDeadline} /><Item label="Shipping destination" value={formatUSAddress(draft.step4.shippingCity,draft.step4.shippingState,draft.step4.shippingZipCode,draft.step4.shippingCountry)} /><Item label="Urgency" value={draft.step4.urgency} /><Item label="Timeline notes" value={draft.step4.additionalTimelineNotes} /></ReviewSection>
      </div>
      <div className="mt-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><Link href="/post-project/timeline" className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#7C7A74] transition hover:border-[#111111] hover:text-[#111111]"><ArrowLeft size={16} className="mr-2" />Back</Link><button type="button" onClick={() => setConfirmSubmit(true)} className="rounded-full bg-[#7C8A6A] px-12 py-5 text-lg font-bold text-white shadow-xl shadow-[#7C8A6A]/10 transition hover:bg-[#667255]">Submit project</button></div>{submitError?<p role="alert" className="mt-4 rounded-2xl border border-[#C9826B] bg-[#F5E6E0]/30 p-4 text-sm text-[#7A3F31]">{submitError} Your draft has not been removed.</p>:null}
    </main>

    {confirmSubmit ? <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/40 p-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmSubmit(false); }}><div role="dialog" aria-modal="true" aria-labelledby="submit-title" className="relative w-full max-w-[620px] rounded-[32px] border border-[#E5E0D8] bg-[#F6F3EE] p-6 shadow-2xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Final step</p><h2 id="submit-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Submit this project?</h2><p className="mt-4 text-sm leading-7 text-[#7C7A74]">You will be asked to sign in if needed. Your local draft is removed only after the server confirms submission.</p></div><button type="button" onClick={() => setConfirmSubmit(false)} aria-label="Close confirmation" className="rounded-full border border-[#E5E0D8] bg-white p-3"><X size={18} /></button></div><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setConfirmSubmit(false)} disabled={submitting} className="rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold disabled:opacity-40">Cancel</button><button type="button" onClick={submitProject} disabled={submitting} className="rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255] disabled:opacity-40">{submitting?"Submitting…":"Confirm submission"}</button></div></div></div> : null}
  </div>;
}
