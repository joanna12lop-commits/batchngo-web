import Image from "next/image";
import Link from "next/link";
import type { MakerCardItem } from "../lib/marketplace-data";

export default function MakerCard({ maker }: { maker: MakerCardItem }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#E5E0D8] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#7C8A6A]">
      <div className="relative h-56 overflow-hidden bg-[#F1EEE8]">
        <Image
          src={maker.image}
          alt={maker.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-[#111111]">{maker.name}</p>
            <p className="mt-1 text-sm text-[#7C7A74]">{maker.specialty}</p>
          </div>
          <span className="rounded-full bg-[#EAF2EC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#3F684F]">
            Sample profile
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {maker.portfolio.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#F1EEE8] px-3 py-1 text-xs font-medium text-[#1F2937]"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="text-sm text-[#7C7A74]">
          <div>
            <p className="font-medium text-[#111111]">Location</p>
            <p className="mt-1">{maker.location}</p>
          </div>
        </div>
        <div className="grid gap-3 rounded-3xl bg-[#EEF1E8] p-4 text-sm text-[#1F2937] sm:grid-cols-2">
          <div>
            <p className="font-semibold">MOQ</p>
            <p className="mt-1">{maker.moq}</p>
          </div>
          <div>
            <p className="font-semibold">Lead time</p>
            <p className="mt-1">{maker.leadTime}</p>
          </div>
        </div>
        <Link href={`/makers/${maker.slug}`} className="inline-flex w-full items-center justify-center rounded-full border border-[#7C8A6A] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">
          View Profile
        </Link>
      </div>
    </article>
  );
}
