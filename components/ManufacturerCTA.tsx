import Image from "next/image";
import Link from "next/link";

export default function ManufacturerCTA() {
  return (
    <section id="for-manufacturers" className="bg-[#EEF1E8] py-24">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1400px] px-6 sm:px-8">
        <div className="grid min-h-[380px] gap-8 overflow-hidden rounded-[40px] bg-[#F2F5EE] p-8 sm:p-10 lg:grid-cols-[minmax(420px,0.46fr)_0.54fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
              Are you a manufacturer?
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
              Receive qualified small-batch requests from growing brands.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#7C7A74]">
              Connect with brand founders sourcing small-batch runs for candles,
              cosmetics, packaging and lifestyle goods.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[28px] bg-[#F6F3EE]">
              <Image
                src="/images/manufacturer-production-line.png"
                alt="Manufacturer production line"
                width={900}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
            <Link
              href="/for-manufacturers/apply"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#7C8A6A] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#667255] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
            >
              Join as a Maker
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
