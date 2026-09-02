import { Check } from "lucide-react";

const steps = ["Business Profile", "Production Capabilities", "Capacity & Operations", "Verification", "Review"];

export default function ManufacturerApplicationProgress({ activeStep }: { activeStep: number }) {
  return <div className="mb-12 max-w-full overflow-x-auto overscroll-x-contain no-scrollbar"><div className="flex w-max min-w-[900px] items-center justify-between rounded-2xl border border-[#E5E0D8] bg-white px-8 py-4 shadow-sm">{steps.map((step, index) => { const number = index + 1; const complete = number < activeStep; const active = number === activeStep; return <div key={step} className="contents"><div className={`flex items-center gap-3 ${number <= activeStep ? "text-[#111111]" : "text-[#7C7A74]/60"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${number <= activeStep ? "border-[#7C8A6A] bg-[#7C8A6A] text-white" : "border-[#E5E0D8]"}`}>{complete ? <Check size={14} /> : number}</span><span className={`text-sm ${active || complete ? "font-bold" : "font-medium"}`}>{step}</span></div>{index < steps.length - 1 ? <div className={`mx-5 h-px flex-grow ${complete ? "bg-[#7C8A6A]" : "bg-[#E5E0D8]"}`} /> : null}</div>; })}</div></div>;
}
