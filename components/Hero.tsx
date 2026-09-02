import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

const benefitItems = [
  "Curated maker profiles",
  "Sample planning",
  "Clear project briefs",
];

export default function Hero() {
  return (
    <section
      id="top"
      className="bg-[#F6F3EE] pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:px-12 xl:grid-cols-[0.48fr_0.52fr] xl:items-center">
        <div className="flex min-h-[560px] flex-col justify-center text-[#111111]">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[#111111] sm:text-[4.5rem] lg:text-[5rem] xl:text-[5.5rem]">
            Turn your product idea into your{" "}
            <span className="font-serif italic text-[#7C8A6A]">
              first batch.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-8 text-[#1F2937] sm:text-2xl">
            The premium marketplace for emerging brands and creators. Post your
            project, explore curated maker profiles, and prepare clear
            production requirements.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/post-project"
              id="post-project"
              className="inline-flex min-w-[170px] items-center justify-center rounded-full bg-[#7C8A6A] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
            >
              Post a Project
            </Link>
            <a
              href="#featured-makers"
              className="inline-flex min-w-[170px] items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-8 py-4 text-base font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
            >
              Browse Makers
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
            {benefitItems.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[#7C7A74]"
              >
                <BadgeCheck size={14} className="text-[#7C8A6A]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full overflow-hidden rounded-[32px] border border-[#E5E0D8] bg-white shadow-[0_28px_80px_rgba(31,41,55,0.08)]">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/hero-products-clean.png"
              alt="Premium product flatlay with candles, notebook, cosmetics pouch, and skincare essentials"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 60vw, 640px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
