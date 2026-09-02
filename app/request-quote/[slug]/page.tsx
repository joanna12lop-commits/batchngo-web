import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import QuoteRequestForm from "../../../components/QuoteRequestForm";
import { getManufacturerBySlug, manufacturers } from "../../../lib/marketplace-data";

export function generateStaticParams() {
  return manufacturers.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export default async function RequestQuotePage({ params }: PageProps<"/request-quote/[slug]">) {
  const { slug } = await params;
  const maker = getManufacturerBySlug(slug);
  if (!maker) notFound();

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header />
      <main className="mx-auto w-full max-w-[960px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#7C7A74]">
          <Link href="/find-makers" className="font-medium transition hover:text-[#111111]">Find Makers</Link><span>/</span>
          <Link href={`/makers/${maker.slug}`} className="font-medium transition hover:text-[#111111]">{maker.businessName}</Link><span>/</span><span className="text-[#1F2937]">Request a Quote</span>
        </nav>
        <section className="mt-6 rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Project inquiry</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl">Request a quote from {maker.businessName}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#7C7A74]">Share the essentials of your project. This prototype stores the request locally on your device and does not send it to the maker.</p>
          <QuoteRequestForm slug={maker.slug} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
