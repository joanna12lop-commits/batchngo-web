import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-[#F6F3EE] py-24">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1400px] px-6 sm:px-8">
        <div className="rounded-[40px] bg-white p-12 sm:p-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
            Ready to bring your brand to life?
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl">
            Ready to bring your brand to life?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#7C7A74] sm:text-lg">
            Join thousands of creators and emerging brands launching their first
            batch on BatchNGo.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/post-project"
              className="inline-flex items-center justify-center rounded-full bg-[#7C8A6A] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
            >
              Post your project
            </Link>
            <Link
              href="/find-makers"
              className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-8 py-4 text-sm font-semibold text-[#1F2937] transition hover:border-[#7C8A6A] hover:bg-[#F6F3EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
            >
              Talk to an expert
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
