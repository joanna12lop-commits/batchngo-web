"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Save, ShieldCheck } from "lucide-react";
import Header from "../../../components/Header";
import { MATERIALS } from "../../../lib/us-marketplace-taxonomy";
import {
  readProjectDraft,
  writeProjectDraft,
  type ProjectStep2,
} from "../../../lib/project-draft";

const materials = [...MATERIALS];

const customizationOptions = [
  "Custom logo", "Custom labels", "Embroidery", "Printing", "Foil stamping",
  "Engraving", "Custom packaging", "Private label", "Other",
];

const complianceOptions = [
  "Vegan", "Cruelty-free", "Organic", "Food-safe", "Cosmetic compliance",
  "CE marking", "FSC materials", "Other",
];

const emptyStep2: ProjectStep2 = {
  productType: "",
  materials: [],
  dimensions: { length: "", width: "", height: "", unit: "cm" },
  colorRequirements: "",
  customizationOptions: [],
  packagingRequirements: "",
  complianceRequirements: [],
  additionalNotes: "",
};

function ProgressBar() {
  const steps = ["Product Category", "Technical Details", "Quantity & Budget", "Timeline", "Review"];
  return (
    <div className="mb-16 overflow-x-auto no-scrollbar">
      <div className="flex min-w-[900px] items-center justify-between rounded-2xl border border-[#E5E0D8] bg-white px-10 py-4 shadow-sm">
        {steps.map((step, index) => (
          <div key={step} className="contents">
            <div className={`flex items-center space-x-3 ${index > 1 ? "text-[#7C7A74]/60" : "text-[#111111]"}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${index <= 1 ? "border-[#7C8A6A] bg-[#7C8A6A] text-white" : "border-[#E5E0D8]"}`}>
                {index === 0 ? <Check size={14} /> : index + 1}
              </span>
              <span className={`text-sm tracking-tight ${index <= 1 ? "font-bold" : "font-medium"}`}>{step}</span>
            </div>
            {index < steps.length - 1 ? <div className={`mx-6 h-px flex-grow ${index === 0 ? "bg-[#7C8A6A]" : "bg-[#E5E0D8]"}`} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChoiceGrid({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (option: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-2xl p-4 text-sm font-semibold transition ${active ? "border-2 border-[#7C8A6A] bg-[#EEF1E8] text-[#111111]" : "border border-[#E5E0D8] bg-[#F6F3EE]/50 text-[#1F2937] hover:border-[#7C8A6A]"}`}>
            <input type="checkbox" checked={active} onChange={() => onToggle(option)} className="h-4 w-4 rounded border-[#E5E0D8] text-[#7C8A6A] focus:ring-[#7C8A6A]" />
            {option}
          </label>
        );
      })}
    </div>
  );
}

export default function TechnicalDetailsPage() {
  const router = useRouter();
  const [step2, setStep2] = useState<ProjectStep2>(emptyStep2);
  const [step1Saved, setStep1Saved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState({ productType: false, materials: false, customizationOptions: false });
  const productTypeRef = useRef<HTMLInputElement>(null);
  const materialsRef = useRef<HTMLDivElement>(null);
  const customizationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDraft = () => {
      const draft = readProjectDraft();
      setStep1Saved(Boolean(draft?.step1));
      if (draft?.step2) setStep2(draft.step2);
    };
    loadDraft();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const isValid = useMemo(
    () => Boolean(step2.productType.trim() && step2.materials.length && step2.customizationOptions.length),
    [step2],
  );

  const update = <K extends keyof ProjectStep2>(field: K, value: ProjectStep2[K]) => {
    setStep2((current) => ({ ...current, [field]: value }));
  };

  const toggle = (field: "materials" | "customizationOptions" | "complianceRequirements", option: string) => {
    const current = step2[field];
    update(field, current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };

  const saveDraft = () => {
    writeProjectDraft({ step2 });
    setMessage("Draft saved locally.");
  };

  const nextStep = () => {
    setAttempted(true);
    if (!isValid) {
      window.setTimeout(() => {
        const first = !step2.productType.trim() ? productTypeRef.current : !step2.materials.length ? materialsRef.current : customizationRef.current;
        first?.scrollIntoView({ behavior: "smooth", block: "center" }); first?.focus();
      }, 0);
      return;
    }
    writeProjectDraft({ step2 });
    router.push("/post-project/quantity-budget");
  };

  const inputClass = "w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-6 py-5 text-lg text-[#111111] outline-none transition-all placeholder:text-[#7C7A74]/50 focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10";
  const labelClass = "mb-4 block text-sm font-bold uppercase tracking-widest text-[#1F2937]";

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header compact />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-8">
        <ProgressBar />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-12">
            <div className="rounded-[2rem] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-12">
              <header className="mb-12">
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#111111]">Define your product specifications</h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#7C7A74]">Add the technical details makers need to understand your project and prepare an accurate quote.</p>
                {step1Saved ? <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#EAF2EC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3F684F]"><Check size={14} /> Product Definition saved</p> : null}
              </header>

              <div className="space-y-12">
                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <label htmlFor="product-type" className="block text-sm font-bold uppercase tracking-widest text-[#1F2937]">Product type or model</label>
                    <span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-bold text-[#7C8A6A]">Required</span>
                  </div>
                  <input ref={productTypeRef} id="product-type" value={step2.productType} onBlur={() => setTouched((current) => ({...current, productType:true}))} onChange={(event) => update("productType", event.target.value)} placeholder="e.g. scented soy candle in a glass jar" aria-invalid={(attempted||touched.productType)&&!step2.productType.trim()||undefined} aria-describedby={(attempted||touched.productType)&&!step2.productType.trim()?"product-type-error":undefined} className={`${inputClass} ${(attempted||touched.productType)&&!step2.productType.trim()?"border-[#C9826B] bg-[#F5E6E0]/30":""}`} />
                  {(attempted||touched.productType)&&!step2.productType.trim() ? <p id="product-type-error" className="mt-3 text-sm text-[#C9826B]">Enter a product type or model</p> : null}
                </div>

                <div ref={materialsRef} tabIndex={-1} onBlur={() => setTouched((current)=>({...current,materials:true}))} aria-invalid={(attempted||touched.materials)&&!step2.materials.length||undefined} aria-describedby={(attempted||touched.materials)&&!step2.materials.length?"materials-error":undefined} className={`rounded-2xl outline-none ${(attempted||touched.materials)&&!step2.materials.length?"ring-2 ring-[#C9826B]/40":""}`}><div className="mb-4 flex items-center justify-between gap-4"><p className="block text-sm font-bold uppercase tracking-widest text-[#1F2937]">Materials</p><span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-bold text-[#7C8A6A]">Required</span></div><ChoiceGrid options={materials} selected={step2.materials} onToggle={(option) => toggle("materials", option)} />{(attempted||touched.materials)&&step2.materials.length === 0 ? <p id="materials-error" className="mt-3 text-sm text-[#C9826B]">Select at least one material</p> : null}</div>

                <div>
                  <p className={labelClass}>Dimensions</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {(["length", "width", "height"] as const).map((dimension) => <label key={dimension} className="text-sm font-semibold capitalize text-[#1F2937]">{dimension}<input inputMode="decimal" value={step2.dimensions[dimension]} onChange={(event) => update("dimensions", { ...step2.dimensions, [dimension]: event.target.value })} className={`${inputClass} mt-2`} /></label>)}
                    <label className="text-sm font-semibold text-[#1F2937]">Unit<select value={step2.dimensions.unit} onChange={(event) => update("dimensions", { ...step2.dimensions, unit: event.target.value })} className={`${inputClass} mt-2`}><option value="mm">mm</option><option value="cm">cm</option><option value="inches">inches</option></select></label>
                  </div>
                </div>

                <div><label htmlFor="colors" className={labelClass}>Color requirements</label><textarea id="colors" rows={4} value={step2.colorRequirements} onChange={(event) => update("colorRequirements", event.target.value)} placeholder="Describe required colors, finishes or Pantone references" className={inputClass} /></div>
                <div ref={customizationRef} tabIndex={-1} onBlur={() => setTouched((current)=>({...current,customizationOptions:true}))} aria-invalid={(attempted||touched.customizationOptions)&&!step2.customizationOptions.length||undefined} aria-describedby={(attempted||touched.customizationOptions)&&!step2.customizationOptions.length?"customization-error":undefined} className={`rounded-2xl outline-none ${(attempted||touched.customizationOptions)&&!step2.customizationOptions.length?"ring-2 ring-[#C9826B]/40":""}`}><div className="mb-4 flex items-center justify-between gap-4"><p className="block text-sm font-bold uppercase tracking-widest text-[#1F2937]">Customization options</p><span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-bold text-[#7C8A6A]">Required</span></div><ChoiceGrid options={customizationOptions} selected={step2.customizationOptions} onToggle={(option) => toggle("customizationOptions", option)} />{(attempted||touched.customizationOptions)&&step2.customizationOptions.length === 0 ? <p id="customization-error" className="mt-3 text-sm text-[#C9826B]">Select at least one customization option</p> : null}</div>
                <div><label htmlFor="packaging" className={labelClass}>Packaging requirements</label><textarea id="packaging" rows={5} value={step2.packagingRequirements} onChange={(event) => update("packagingRequirements", event.target.value)} placeholder="Describe individual packaging, boxes, inserts, labels or retail-ready requirements" className={inputClass} /></div>
                <div><p className={labelClass}>Quality or compliance requirements</p><ChoiceGrid options={complianceOptions} selected={step2.complianceRequirements} onToggle={(option) => toggle("complianceRequirements", option)} /></div>
                <div><label htmlFor="notes" className={labelClass}>Additional technical notes</label><textarea id="notes" rows={5} value={step2.additionalNotes} onChange={(event) => update("additionalNotes", event.target.value)} className={inputClass} /></div>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/post-project" className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#7C7A74] transition-all hover:border-[#111111] hover:text-[#111111]"><ArrowLeft size={16} className="mr-2" />Back</Link>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button type="button" onClick={saveDraft} className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#7C7A74] transition-all hover:border-[#111111] hover:text-[#111111]"><Save size={16} className="mr-2" />Save as draft</button>
                <div className="flex flex-col gap-2">
                  {!isValid ? <p className="text-sm text-[#7C7A74]">Complete all required fields to continue.</p> : null}
                  <button type="button" onClick={nextStep} className="flex items-center justify-center rounded-full bg-[#7C8A6A] px-12 py-5 text-lg font-bold text-white shadow-xl shadow-[#7C8A6A]/10 transition-all hover:bg-[#667255]">Next Step<ArrowRight size={18} className="ml-3" /></button>
                </div>
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
                <li className="flex items-start space-x-5"><div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#7C8A6A] text-xs font-bold text-white">2</div><div><h4 className="mb-1 text-sm font-bold text-[#111111]">Technical Specs</h4><p className="text-xs leading-relaxed text-[#7C7A74]">Define materials, dimensions, and customization needs.</p></div></li>
                <li className="flex items-start space-x-5 opacity-60"><div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F6F3EE] text-xs font-bold text-[#7C7A74]">3</div><div><h4 className="mb-1 text-sm font-bold text-[#111111]">Volume & Logistics</h4><p className="text-xs leading-relaxed text-[#7C7A74]">Upcoming</p></div></li>
              </ul>
              <div className="mt-10 border-t border-[#E5E0D8] pt-6"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C8A6A]"><ShieldCheck size={15} />Tip</div><p className="mt-3 text-sm leading-7 text-[#7C7A74]">The more precise your specifications are, the more accurate maker quotes will be.</p></div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
