export default function ProtectionSection() {
  return (
    <section className="bg-[#F6F3EE] py-24">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1400px] px-6 sm:px-8">
        <div className="rounded-[40px] border border-[#374151] bg-[#111827] p-10 sm:p-14">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Order with complete{" "}
              <span className="text-[#7C8A6A]">protection.</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-[#1f2937] bg-[#111827] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                Secure Escrow
              </p>
              <p className="mt-4 text-base leading-8 text-[#D1D5DB]">
                Your payment is held securely and only released to the maker
                once you approve each production milestone.
              </p>
            </div>
            <div className="rounded-[28px] border border-[#1f2937] bg-[#111827] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                Quality Guarantee
              </p>
              <p className="mt-4 text-base leading-8 text-[#D1D5DB]">
                If the final production doesn’t match your approved sample,
                we’ll step in to mediate or provide a refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
