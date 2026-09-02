import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import SaveMakerButton from "../../../components/SaveMakerButton";
import {
  getManufacturerBySlug,
  manufacturers,
  type Manufacturer,
} from "../../../lib/marketplace-data";

export function generateStaticParams() {
  return manufacturers.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

function ProfileBadge() {
  return (
    <span
      className="rounded-full bg-[#F1EEE8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]"
    >
      SAMPLE PROFILE
    </span>
  );
}

const yesNo = (value: boolean) => (value ? "Available" : "Not available");

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[#F6F3EE] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C7A74]">{label}</p>
      <p className="mt-2 font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-[#F1EEE8] px-3 py-2 text-sm font-medium text-[#1F2937]">
          {item}
        </span>
      ))}
    </div>
  );
}

function QuotePanel({ maker }: { maker: Manufacturer }) {
  return (
    <div className="rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Request a quote</p>
      <div className="mt-6 space-y-4 border-y border-[#E5E0D8] py-5 text-sm">
        <div className="flex justify-between gap-4"><span className="text-[#7C7A74]">Starting MOQ</span><strong>{maker.moq}</strong></div>
        <div className="flex justify-between gap-4"><span className="text-[#7C7A74]">Lead time</span><strong>{maker.leadTime}</strong></div>
        <div className="flex justify-between gap-4"><span className="text-[#7C7A74]">Samples</span><strong>{yesNo(maker.sampleAvailable)}</strong></div>
      </div>
      <p className="mt-5 text-sm leading-7 text-[#7C7A74]">Tell this maker what you want to produce and request a quote.</p>
      <Link href={`/request-quote/${maker.slug}`} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">
        Request a Quote
      </Link>
    </div>
  );
}

export default async function MakerProfilePage({ params }: PageProps<"/makers/[slug]">) {
  const { slug } = await params;
  const maker = getManufacturerBySlug(slug);
  if (!maker) notFound();

  const facts = [
    ["Starting MOQ", maker.moq], ["Typical lead time", maker.leadTime],
    ["Sample availability", yesNo(maker.sampleAvailable)], ["Sample lead time", maker.sampleLeadTime],
    ["Monthly capacity", maker.monthlyCapacity], ["Shipping regions", maker.shippingRegions.join(", ")],
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F3EE] text-[#1F2937]">
      <Header />
      <main className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#7C7A74]">
          <Link href="/find-makers" className="font-medium transition hover:text-[#111111]">Find Makers</Link>
          <span aria-hidden="true">/</span><span className="text-[#1F2937]">{maker.businessName}</span>
        </nav>

        <section className="mt-6 grid gap-8 rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#F1EEE8]">
              <Image src={maker.image} alt={maker.alt} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {maker.portfolioImages.slice(0, 4).map((image) => (
                <div key={`${maker.slug}-${image.src}`} className="relative aspect-square overflow-hidden rounded-[24px] bg-[#F1EEE8]">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3"><ProfileBadge /><span className="rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">{maker.supplierType}</span></div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl">{maker.businessName}</h1>
            <p className="mt-3 text-base text-[#7C7A74]">{maker.location}</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#7C7A74]">{maker.shortDescription}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3"><Fact label="MOQ" value={maker.moq} /><Fact label="Lead time" value={maker.leadTime} /><Fact label="Samples" value={yesNo(maker.sampleAvailable)} /></div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`/request-quote/${maker.slug}`} className="inline-flex items-center justify-center rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]">Request a Quote</Link>
              <SaveMakerButton slug={maker.slug} />
            </div>
          </div>
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section className="rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Quick facts</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{facts.map(([label, value]) => <Fact key={label} label={label} value={value} />)}</div>
            </section>

            <section className="rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl font-semibold text-[#111111]">About</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#7C7A74]">{maker.fullDescription}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2"><Fact label="Business location" value={maker.location} /><Fact label="Manufacturing facility" value={`${maker.facilityLocation.city}, ${maker.facilityLocation.state} ${maker.facilityLocation.zipCode}, ${maker.facilityLocation.country}`} /><Fact label="U.S.-based company" value={yesNo(maker.usBasedCompany)} /><Fact label="Manufacturing performed in the U.S." value={yesNo(maker.usManufacturing)} /><Fact label="Manufacturer-supplied origin claim" value={maker.originClaim} /><Fact label="Years in business" value={`${maker.yearsInBusiness} years`} /><Fact label="Team size" value={maker.teamSize} /><Fact label="Shipping regions" value={maker.shippingRegions.join(", ")} /></div>
            </section>

            <section className="rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl font-semibold text-[#111111]">Capabilities</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {[["Packaging types", maker.packagingTypes], ["Materials", maker.materials], ["Printing methods", maker.printingMethods], ["Finishing capabilities", maker.finishingCapabilities], ["Filling capabilities", maker.fillingCapabilities], ["Industries served", maker.industriesServed]].map(([title, items]) => <div key={title as string}><h3 className="font-semibold text-[#111111]">{title as string}</h3><Tags items={items as string[]} /></div>)}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">{[["Assembly and kitting", maker.assemblyAndKitting], ["Sample availability", maker.sampleAvailable], ["Prototype availability", maker.prototypeAvailable]].map(([label, enabled]) => <div key={label as string} className="flex items-center gap-3 rounded-[24px] bg-[#EEF1E8] p-4 text-sm font-semibold"><Check size={18} className="text-[#7C8A6A]" />{label as string}: {enabled ? "Yes" : "No"}</div>)}</div>
            </section>

            <section className="rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl font-semibold text-[#111111]">Production details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><Fact label="Minimum order quantity" value={maker.moq} /><Fact label="Production lead time" value={maker.leadTime} /><Fact label="Sample lead time" value={maker.sampleLeadTime} /><Fact label="Monthly capacity" value={maker.monthlyCapacity} /><Fact label="Shipping regions" value={maker.shippingRegions.join(", ")} /><Fact label="Customization level" value={maker.customizationLevel} /></div>
              <div className="mt-6"><h3 className="font-semibold text-[#111111]">Accepted project types</h3><Tags items={maker.acceptedProjectTypes} /></div>
            </section>

            <section>
              <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Selected work</p><h2 className="mt-3 text-3xl font-semibold text-[#111111]">Portfolio</h2></div>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{maker.portfolioImages.map((image) => <div key={`portfolio-${image.src}`} className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-[#E5E0D8] bg-white shadow-sm"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" /></div>)}</div>
            </section>

          </div>
          <aside><QuotePanel maker={maker} /></aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
