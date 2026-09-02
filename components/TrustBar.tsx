import { CheckCircle2, ShieldCheck, ShieldAlert, Truck } from "lucide-react";

const trustItems = [
  { title: "Curated maker profiles", icon: ShieldCheck },
  { title: "Sample planning", icon: CheckCircle2 },
  { title: "Structured production milestones", icon: ShieldAlert },
  { title: "Transparent project workflow", icon: Truck },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-t border-b border-[#E5E0D8] py-6 sm:py-8">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-4 text-sm text-[#1F2937] sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-3xl bg-[#F6F3EE] px-4 py-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-3xl bg-[#EEF1E8] text-[#7C8A6A]">
                  <Icon size={18} />
                </span>
                <span className="font-semibold">{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
