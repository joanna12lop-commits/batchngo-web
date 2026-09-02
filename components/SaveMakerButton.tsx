"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "batchngo-saved-makers";

export default function SaveMakerButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedMakers = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as string[];
      setSaved(savedMakers.includes(slug));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [slug]);

  const toggleSaved = () => {
    const savedMakers = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as string[];
    const next = savedMakers.includes(slug)
      ? savedMakers.filter((item) => item !== slug)
      : [...savedMakers, slug];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
  };

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-pressed={saved}
      className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C8A6A]"
    >
      {saved ? "Saved" : "Save Maker"}
    </button>
  );
}
