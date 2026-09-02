export default function ProtectionSection() {
  return (
    <section className="bg-[#F6F3EE] py-24">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1400px] px-6 sm:px-8">
        <div className="rounded-[40px] border border-[#374151] bg-[#111827] p-10 sm:p-14">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Plan production with{" "}
              <span className="text-[#7C8A6A]">clearer details.</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-[#1f2937] bg-[#111827] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                Compare production options
              </p>
              <p className="mt-4 text-base leading-8 text-[#D1D5DB]">
                Review estimated pricing, minimum quantities, sample availability,
                lead times, and production locations in a structured format.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#1f2937] bg-[#111827] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                Documented requirements
              </p>
              <p className="mt-4 text-base leading-8 text-[#D1D5DB]">
                Record product specifications and sample expectations clearly
                before deciding how to move toward production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
