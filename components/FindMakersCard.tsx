import Image from "next/image";
import Link from "next/link";
import type { Manufacturer } from "../lib/marketplace-data";

export default function FindMakersCard({ maker }: { maker: Manufacturer }) {
  return (
    <Link
      href={`/makers/${maker.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-[#E5E0D8] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#7C8A6A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F1EEE8]">
        <Image
          src={maker.image}
          alt={maker.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-[#111111]">{maker.businessName}</p>
            <p className="mt-1 text-sm text-[#7C7A74]">{maker.supplierType}</p>
          </div>
          <span className="rounded-full bg-[#F1EEE8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
            SAMPLE PROFILE
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
            {maker.category}
          </span>
          {maker.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F1EEE8] px-3 py-1 text-xs font-medium text-[#1F2937]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm text-[#7C7A74]">
          <div>
            <p className="font-medium text-[#111111]">Location</p>
            <p className="mt-1">{maker.location}</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[24px] bg-[#EEF1E8] p-4 text-sm text-[#1F2937] sm:grid-cols-2">
          <div>
            <p className="font-semibold">MOQ</p>
            <p className="mt-1">{maker.moq}</p>
          </div>
          <div>
            <p className="font-semibold">Lead time</p>
            <p className="mt-1">{maker.leadTime}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#7C7A74]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F1EEE8] px-3 py-2 text-sm font-medium text-[#1F2937]">
            {maker.sampleAvailable ? "Sample available" : "No sample"}
          </span>
          {maker.prototypeAvailable ? <span className="inline-flex rounded-full bg-[#F1EEE8] px-3 py-2 text-sm font-medium text-[#1F2937]">Prototype available</span> : null}
        </div>

        <span className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937] transition group-hover:bg-[#EEF1E8]">
          View Profile
        </span>
      </div>
    </Link>
  );
}
