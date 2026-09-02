import Image from "next/image";
import Link from "next/link";
import { Box, Droplet, Flame, ShoppingBag } from "lucide-react";
import { MARKETPLACE_CATEGORIES } from "../lib/us-marketplace-taxonomy";

const categoryIcons = {
  "beauty-personal-care": Droplet,
  "candles-home-fragrance": Flame,
  "custom-packaging": Box,
  "textile-accessories-pouches": ShoppingBag,
};

export default function CategoryGrid() {
  return (
    <section
      id="categories"
      className="bg-[#F6F3EE] py-16 sm:py-20 scroll-mt-28"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
            Categories
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Discover boutique categories built for small-batch brands.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#7C7A74]">
            Browse maker profiles across four focused small-batch categories.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETPLACE_CATEGORIES.map((item) => {
            const Icon = categoryIcons[item.slug];
            return (
              <Link
                key={item.slug}
                href={`/find-makers?category=${item.slug}`}
                aria-label={`Browse makers in ${item.name}`}
                className="group overflow-hidden rounded-[32px] border border-[#E5E0D8] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#7C8A6A] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
              >
                <div className="relative h-56 overflow-hidden bg-[#F1EEE8]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1E8] px-3 py-2 text-sm font-semibold text-[#7C8A6A]">
                    <Icon size={16} />
                    {item.name}
                  </div>
                  <p className="text-lg font-semibold text-[#111111]">
                    {item.name}
                  </p>
                  <p className="text-sm leading-7 text-[#7C7A74]">
                    {item.description}
                  </p>
                  <p className="text-sm font-semibold text-[#7C8A6A]">
                    {item.moq}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
