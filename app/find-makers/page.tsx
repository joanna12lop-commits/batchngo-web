"use client";

import { useMemo, useState } from "react";
import Header from "../../components/Header";
import FindMakersCard from "../../components/FindMakersCard";
import { manufacturers } from "../../lib/marketplace-data";
import { PRODUCT_CATEGORIES, SUPPLIER_TYPES, US_REGIONS, US_STATES } from "../../lib/us-marketplace-taxonomy";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

const categories = [...PRODUCT_CATEGORIES];
const MOQOptions = ["Any", "0-100", "101-150", "151+"];
const leadTimeOptions = ["Any", "Up to 2 weeks", "3-4 weeks", "5+ weeks"];
const sortOptions = [
  "Recommended",
  "Rating",
  "Lowest MOQ",
  "Fastest lead time",
];

export default function FindMakersPage() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState("Any");
  const [region, setRegion] = useState("Any");
  const [shippingState, setShippingState] = useState("Any");
  const [supplierType, setSupplierType] = useState("Any");
  const [moq, setMoq] = useState("Any");
  const [leadTime, setLeadTime] = useState("Any");
  const [sampleOnly, setSampleOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");

  const filteredMakers = useMemo(() => {
    let result = manufacturers.filter((maker) => {
      const matchesQuery =
        maker.businessName.toLowerCase().includes(query.toLowerCase()) ||
        maker.specialty.toLowerCase().includes(query.toLowerCase()) ||
        maker.category.toLowerCase().includes(query.toLowerCase()) ||
        maker.location.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category === "Any" || maker.category === category;
      const matchesRegion = region === "Any" || maker.shippingRegions.includes(region);
      const matchesState = shippingState === "Any" || maker.shippingStates.includes(shippingState);
      const matchesSupplierType = supplierType === "Any" || maker.supplierType === supplierType;
      const matchesMoq =
        moq === "Any" ||
        (moq === "0-100" && maker.moqValue <= 100) ||
        (moq === "101-150" && maker.moqValue >= 101 && maker.moqValue <= 150) ||
        (moq === "151+" && maker.moqValue >= 151);
      const matchesLeadTime =
        leadTime === "Any" ||
        (leadTime === "Up to 2 weeks" && maker.leadTimeValue <= 14) ||
        (leadTime === "3-4 weeks" &&
          maker.leadTimeValue >= 15 &&
          maker.leadTimeValue <= 28) ||
        (leadTime === "5+ weeks" && maker.leadTimeValue > 28);
      const matchesSample = !sampleOnly || maker.sampleAvailable;
      const matchesVerified = !verifiedOnly || maker.verified;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesRegion && matchesState && matchesSupplierType &&
        matchesMoq &&
        matchesLeadTime &&
        matchesSample &&
        matchesVerified
      );
    });

    if (sortBy === "Rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Lowest MOQ") {
      result = [...result].sort((a, b) => a.moqValue - b.moqValue);
    } else if (sortBy === "Fastest lead time") {
      result = [...result].sort((a, b) => a.leadTimeValue - b.leadTimeValue);
    }

    return result;
  }, [
    query,
    category,
    region, shippingState, supplierType,
    moq,
    leadTime,
    sampleOnly,
    verifiedOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header />
      <main className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-20 sm:px-6 sm:pt-24">
        <div className="space-y-8">
          <section className="rounded-[32px] border border-[#E5E0D8] bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                  Find Makers
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111] sm:text-5xl">
                  Explore small-batch maker profiles
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#7C7A74]">
                  Search and filter curated maker profiles by category, location, MOQ,
                  lead time and sample availability.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E0D8] bg-white px-5 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8] lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1.5fr_1fr] lg:grid-cols-[1fr_0.75fr]">
              <label className="relative block">
                <span className="sr-only">Search makers</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7C7A74]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search makers, specialties or location"
                  className="w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 py-4 pl-12 pr-4 text-base text-[#111111] outline-none transition focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10"
                />
              </label>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#EEF1E8] px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-14 min-w-[190px] rounded-2xl border border-[#E5E0D8] bg-white px-4 text-sm text-[#111111] outline-none focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
            <aside
              className={`${showFilters ? "block" : "hidden"} lg:block lg:w-[260px]`}
            >
              <div className="rounded-[32px] border border-[#E5E0D8] bg-white p-8 shadow-sm lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                      Filters
                    </p>
                    <p className="mt-2 text-sm text-[#7C7A74]">
                      Narrow your search for the right maker.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#1F2937] transition hover:border-[#7C8A6A] lg:hidden"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 text-sm text-[#111111] outline-none focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10"
                    >
                      <option>Any</option>
                      {categories.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">
                      Supplier type
                    </label>
                    <select
                      value={supplierType}
                      onChange={(event) => setSupplierType(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 text-sm text-[#111111] outline-none focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10"
                    >
                      <option>Any</option>
                      {SUPPLIER_TYPES.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2"><label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">Shipping region</label><select value={region} onChange={event=>setRegion(event.target.value)} className="h-14 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 text-sm"><option>Any</option>{US_REGIONS.map(option=><option key={option}>{option}</option>)}</select></div>
                  <div className="space-y-2"><label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">State served</label><select value={shippingState} onChange={event=>setShippingState(event.target.value)} className="h-14 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 text-sm"><option>Any</option>{US_STATES.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">
                      MOQ
                    </label>
                    <select
                      value={moq}
                      onChange={(event) => setMoq(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 text-sm text-[#111111] outline-none focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10"
                    >
                      {MOQOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">
                      Lead time
                    </label>
                    <select
                      value={leadTime}
                      onChange={(event) => setLeadTime(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 text-sm text-[#111111] outline-none focus:border-[#7C8A6A] focus:ring-4 focus:ring-[#7C8A6A]/10"
                    >
                      {leadTimeOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1F2937]">
                      Availability
                    </label>
                    <div className="grid gap-3">
                      <label className="inline-flex items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 py-3 text-sm text-[#1F2937]">
                        <input
                          type="checkbox"
                          checked={sampleOnly}
                          onChange={(event) =>
                            setSampleOnly(event.target.checked)
                          }
                          className="h-4 w-4 rounded border-[#E5E0D8] text-[#7C8A6A] focus:ring-[#7C8A6A]"
                        />
                        Sample available
                      </label>
                      <label className="inline-flex items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-[#F6F3EE]/60 px-4 py-3 text-sm text-[#1F2937]">
                        <input
                          type="checkbox"
                          checked={verifiedOnly}
                          onChange={(event) =>
                            setVerifiedOnly(event.target.checked)
                          }
                          className="h-4 w-4 rounded border-[#E5E0D8] text-[#7C8A6A] focus:ring-[#7C8A6A]"
                        />
                        Curated profiles only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4 rounded-[32px] border border-[#E5E0D8] bg-white p-6 shadow-sm">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                    Results
                  </p>
                  <p className="mt-2 text-sm text-[#7C7A74]">
                    {filteredMakers.length} makers matching your filters.
                  </p>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-[#EEF1E8] px-4 py-2 text-sm font-semibold text-[#7C8A6A] sm:flex">
                  <SlidersHorizontal size={16} />
                  Filters applied
                </div>
              </div>

              {filteredMakers.length === 0 ? (
                <div className="rounded-[32px] border border-[#E5E0D8] bg-white p-12 text-center shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                    No results found
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-[#111111]">
                    Try adjusting your filters or search term.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#7C7A74]">
                    No makers match the current criteria. Reset filters to see
                    more small-batch maker profiles.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("Any");
                      setRegion("Any"); setShippingState("Any"); setSupplierType("Any");
                      setMoq("Any");
                      setLeadTime("Any");
                      setSampleOnly(false);
                      setVerifiedOnly(false);
                      setQuery("");
                      setSortBy("Recommended");
                    }}
                    className="mt-8 inline-flex rounded-full border border-[#E5E0D8] bg-white px-8 py-4 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8]"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 min-[1200px]:grid-cols-3 auto-rows-fr">
                  {filteredMakers.map((maker) => (
                    <FindMakersCard key={maker.id} maker={maker} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
