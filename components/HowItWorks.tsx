import { howItWorksSteps } from "../lib/marketplace-data";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Simple, transparent steps from brief to batch.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#7C7A74]">
            Post your project, review verified maker proposals, approve a
            sample, and start production with support every step of the way.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-[32px] border border-[#E5E0D8] bg-[#F6F3EE] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7C8A6A]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#EEF1E8] text-[#7C8A6A] shadow-sm">
                  <Icon size={22} />
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F2937] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-[#111111]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#7C7A74]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
