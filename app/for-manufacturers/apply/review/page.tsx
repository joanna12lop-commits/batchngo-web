"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import ManufacturerApplicationProgress from "../../../../components/ManufacturerApplicationProgress";
import {
  MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY,
  MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY,
  createEmptyManufacturerApplicationDraft,
  readManufacturerApplicationDraft,
  type ManufacturerApplicationDraft,
} from "../../../../lib/manufacturer-application-draft";
import { formatUSAddress } from "../../../../lib/us-marketplace-taxonomy";

function Section({ title, href, items }: { title: string; href: string; items: Array<[string, unknown]> }) {
  const display = (value: unknown) =>
    Array.isArray(value)
      ? value.join(", ")
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value || "Not provided");
  return (
    <section className="rounded-[28px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex justify-between gap-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-[#7C8A6A] underline">Edit</Link>
      </div>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C7A74]">{label}</dt>
            <dd className="mt-2 break-words text-sm leading-7">{display(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function ManufacturerReviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<ManufacturerApplicationDraft>(() => createEmptyManufacturerApplicationDraft());
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    // Draft hydration intentionally occurs after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(readManufacturerApplicationDraft() ?? createEmptyManufacturerApplicationDraft());
  }, []);

  const submit = async () => {
    if (!confirmed || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/submit/manufacturer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (response.status === 401) {
        router.push("/login?next=/for-manufacturers/apply/review");
        return;
      }
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "We could not submit your application.");

      localStorage.removeItem(MANUFACTURER_APPLICATION_DRAFT_STORAGE_KEY);
      sessionStorage.removeItem(MANUFACTURER_APPLICATION_DRAFT_SESSION_KEY);
      router.push("/for-manufacturers/apply/success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not submit your application.");
      setSubmitting(false);
    }
  };

  const business = draft.step1;
  const cap = draft.step2;
  const ops = draft.step3;
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Header />
      <main className="mx-auto max-w-[1100px] px-4 pb-20 pt-20 sm:px-6">
        <ManufacturerApplicationProgress activeStep={5} />
        <h1 className="mb-3 text-4xl font-semibold">Review Application</h1>
        <p className="mb-10 text-lg text-[#7C7A74]">Review your U.S. supplier profile before submitting it.</p>
        <div className="space-y-6">
          <Section title="Business profile" href="/for-manufacturers/apply" items={[["Business name",business.businessName],["Supplier type",business.supplierTypes],["Business location",formatUSAddress(business.businessCity,business.businessState,business.businessZipCode,business.businessCountry)],["U.S.-based company",business.usBasedCompany],["Manufacturing performed in the U.S.",business.usManufacturing],["Manufacturer-supplied origin claim",business.originClaim],["Typical MOQ",business.minimumOrderQuantity],["Lead time",business.typicalLeadTime]]} />
          <Section title="Capabilities" href="/for-manufacturers/apply/capabilities" items={[["Packaging types",cap.packagingTypes],["Materials",cap.materials],["Printing methods",cap.printingMethods],["Finishing capabilities",cap.finishingCapabilities],["Filling capabilities",cap.fillingCapabilities],["Assembly and kitting",cap.assemblyAndKitting],["Prototype availability",cap.prototypeAvailable],["Industries served",cap.industriesServed]]} />
          <Section title="Capacity & operations" href="/for-manufacturers/apply/operations" items={[["Manufacturing facility",formatUSAddress(ops.facilityCity,ops.facilityState,ops.facilityZipCode,ops.facilityCountry)],["Shipping regions",ops.shippingRegions],["States served",ops.shippingStates],["Monthly capacity",ops.monthlyCapacity],["Maximum order capacity",ops.maximumOrderCapacity],["Sample availability",ops.sampleAvailable],["Sample lead time",ops.sampleLeadTime],["Team size",ops.teamSize]]} />
        </div>
        <div className="mt-8 rounded-[28px] border border-[#E5E0D8] bg-white p-6">
          <label className="flex gap-3 text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />I confirm that the information provided is accurate.</label>
        </div>
        {submitError ? <p role="alert" className="mt-5 rounded-2xl border border-[#C9826B] bg-[#F5E6E0] p-4 text-sm text-[#7A3F31]">{submitError} Your draft is still safe.</p> : null}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Link href="/for-manufacturers/apply/verification" className="rounded-full border border-[#E5E0D8] bg-white px-8 py-4 text-center font-bold">Back</Link>
          <button onClick={submit} disabled={!confirmed || submitting} className="rounded-full bg-[#7C8A6A] px-8 py-4 font-bold text-white disabled:opacity-40">{submitting ? "Submitting…" : "Submit application"}</button>
        </div>
      </main>
    </div>
  );
}
