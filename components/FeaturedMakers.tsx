import MakerCard from "./MakerCard";
import { featuredMakers } from "../lib/marketplace-data";

export default function FeaturedMakers() {
  return (
    <section
      id="featured-makers"
      className="relative bg-[#F6F3EE] py-16 sm:py-20"
    >
      <span id="find-makers" className="absolute -top-28 block" />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
            Marketplace preview
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Makers who bring boutique ideas to life.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#7C7A74]">
            Explore a curated selection of example small-batch maker profiles
            with packaging, wellness, print and textile expertise.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredMakers.map((maker) => (
            <MakerCard key={maker.slug} maker={maker} />
          ))}
        </div>
      </div>
    </section>
  );
}
